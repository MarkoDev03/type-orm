import { Request, Response, NextFunction } from "express";
import { IAuthUser } from "../models/auth-user";
import { AvatarService } from "../services/avatar-service";
import { UserService } from "../services/user-service";
import { HttpError } from "../errors/http-error";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { Directory, File } from "../utils/file-system";
import sharp from "sharp";
import { Environment } from "../configuration/environment";
import { Avatar } from "../models/entities/avatar";

const _avatarService = new AvatarService();
const _userService = new UserService();

export class AvatarController {
  public async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    const file = req.file;

    if (!Environment.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new HttpError(Constants.FileTypeNotSupported, StatusCodes.NOT_ACCEPTABLE);
    }

    const { userId } = req.user as IAuthUser;

    const entityExist = await _userService.entityExistAsync(userId);

    if (!entityExist) {
      throw new HttpError(Constants.EndpointNotFound, StatusCodes.NOT_FOUND);
    }

    const rootPath = path.join(path.resolve("files"), userId.toString());
    const userDirExist = await Directory.existAsync(rootPath);

    if (!userDirExist) {
      await Directory.createAsync(rootPath);
    }

    let fileBuffer = await
      sharp(file.buffer)
        .resize(Environment.MAX_IMG_HEIGHT)
        .toBuffer();

    if (file.mimetype != "image/webp") {
      fileBuffer = await sharp(fileBuffer)
        .webp()
        .toBuffer();
    }

    const imgPath = path.join(rootPath, Environment.DEFAULT_IMAGE_NAME);
    const imageExist = await File.existAsync(imgPath);

    const model: Partial<Avatar> = {
      userId: userId,
      originalName: file.originalname,
      fileName: Environment.DEFAULT_IMAGE_NAME,
      size: fileBuffer.length,
      originalType: file.mimetype,
      type: Environment.DEFAULT_IMAGE_NAME.split('.')[1],
      timeUpdated: new Date(),
    };

    if (!imageExist) {
      await File.createAsync(rootPath, fileBuffer);

      model.timeUploaded = new Date();
      await _avatarService.createAsync(model as Avatar);

      res.status(200).json({ message: Constants.ProfileImageAdded })
    }

    await File.updateAsync(rootPath, fileBuffer);

    const entity = await _avatarService.getByUserIdAsync(userId);

    if (entity != null) {
      await _avatarService.updateAsync(model as Avatar);
    }

    res.status(200).json({ message: Constants.ProfileImagUpdated })
  }

  public async removeProfilePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.user as IAuthUser;

    const entityExist = await _userService.entityExistAsync(userId);

    if (!entityExist) {
      throw new HttpError(Constants.EndpointNotFound, StatusCodes.NOT_FOUND);
    }

    const rootPath = path.join(path.resolve("files"), userId.toString());
    const imgPath = path.join(rootPath, Environment.DEFAULT_IMAGE_NAME);
    const imageExist = await File.existAsync(imgPath);

    if (!imageExist) {
      throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);
    }

    await Directory.deleteAsync(rootPath);

    const entity = await _avatarService.getByUserIdAsync(userId);

    if (entity) {
      await _avatarService.deleteAsync(entity.id);
    }

    res.status(StatusCodes.OK).json({ message: Constants.EntityDeleted });
  }

  public async download(req: Request, res: Response, next: NextFunction): Promise<void> {}

  public async preview(req: Request, res: Response, next: NextFunction): Promise<void> {}
}
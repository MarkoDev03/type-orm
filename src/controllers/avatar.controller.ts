import { Request, Response, NextFunction } from "express";
import { IAuthUser } from "../models/auth-user";
import { AvatarService } from "../services/avatar-service";
import { UserService } from "../services/user-service";
import { HttpError } from "../errors/http-error";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { Directory, File } from "../utils/file-system";

const _avatarService = new AvatarService();
const _userService = new UserService();

export class AvatarController {
  public async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    const file = req.file;
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

    await File.createAsync(rootPath, file.buffer);

    // await _avatarService.createAsync({
    //    userId: userId,
    // });
  }
}
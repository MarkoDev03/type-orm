import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user-service";
import { HttpError } from "../errors/http-error";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/entities/user";
import { Environment } from "../configuration/environment";
import bcrpyt from "bcrypt";
import { MailSender } from "../utils/mail-sender";
import { CronJob } from "../utils/cron-job";
import { UserTokenService } from "../services/user-token-service";
import { v4 } from "uuid";
import { UserToken } from "../models/entities/user-token";
import { SettingsService } from "../services/settings-service";
import { SettingKeys } from "../configuration/setting-keys";
import { IAuthUser } from "../models/auth-user";
import Logger from "../core/logger";

const _userService = new UserService();
const _userTokenService = new UserTokenService();
const _settingsService = new SettingsService();

export class AccountController {

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const entity = req.body as User;

    const isUsernameTaken = await _userService.isUsernameTakenAsync(entity.username);

    if (isUsernameTaken) {
      throw new HttpError(Constants.UsernameTaken, StatusCodes.BAD_REQUEST);
    }

    const isEmailTaken = await _userService.isEmailTakenAsync(entity.email);

    if (isEmailTaken) {
      throw new HttpError(Constants.EmailTaken, StatusCodes.BAD_REQUEST);
    }

    entity.timeCreated = new Date();
    entity.isVerified = false;

    const salt = await bcrpyt.genSalt(Environment.SALT);
    const hashedPassword = await bcrpyt.hash(entity.password, salt);
    entity.password = hashedPassword;

    const model = await _userService.createAsync(entity);

    const token = v4();
    const currentTime = new Date();

    const tokenExpTime = await _settingsService.getByKeyAsync<number>(SettingKeys.AuthValidationTokenExpTime);
    const expireTime = new Date(currentTime.setHours(currentTime.getHours() + tokenExpTime));

    await _userTokenService.createAsync({
      token: token,
      expiresAt: expireTime,
      userId: model.id
    } as UserToken);

    let task = MailSender.sendAsync(token, Constants.AccountCreated, [entity.email]);
    CronJob.executeNow(task);

    CronJob.schedule(expireTime, async () => {
      const userToken = await _userTokenService.getByTokenAsync(token);

      if (userToken != null) {
        await _userTokenService.deleteAsync(userToken.id);
      }
    });

    res.status(StatusCodes.OK).json({
      message: Constants.AccountCreated,
      token: token,
      userId: model.id
    });
  }

  async info(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.user as IAuthUser;
    const entity = await _userService.getByIdAsync(userId);

    if (!entity) {
      throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);
    }

    delete entity.password;

    res.status(StatusCodes.OK).json(entity);
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.params.token;

    const userToken = await _userTokenService.getByTokenAsync(token);

    if (!userToken) {
      throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);
    }

    const user = await _userService.getByIdAsync(userToken.userId);

    if (user.isVerified == true) {
      throw new HttpError(Constants.AlreadyVerified, StatusCodes.BAD_REQUEST);
    }

    user.isVerified = true;

    await _userService.updateAsync(user);
    await _userTokenService.deleteAsync(userToken.id);

    res.status(StatusCodes.OK).json({ message: Constants.AccountVerified });
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { password } = req.body;
    const { userId } = req.user as IAuthUser;

    const user = await _userService.getByIdAsync(userId);

    if (!user) {
      throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);
    }

    const comparePasswords = await bcrpyt.compare(password, user.password);

    if (!comparePasswords) {
      throw new HttpError(Constants.WrongPassword, StatusCodes.BAD_GATEWAY);
    }

    await _userService.deleteAsync(userId);

    Logger.error(Constants.UserDeletedAccount + userId);

    res.status(StatusCodes.OK).json({ message: Constants.EntityDeleted });
  }

  async updateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.user as IAuthUser;
    const { email, phone } = req.body;

    const user = await _userService.getByIdAsync(userId);

    if (!user) {
      throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);
    }

    const isEmailTaken = await _userService.isEmailTakenAsync(email);

    if (isEmailTaken) {
      throw new HttpError(Constants.EmailTaken, StatusCodes.BAD_REQUEST);
    }

    user.email = email;
    user.phone = phone;

    await _userService.updateAsync(user);

    res.status(StatusCodes.OK).json({ message: Constants.EntityUpdated });
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.user as IAuthUser;
    const { oldPassword, newPassword } = req.body;

    const user = await _userService.getByIdAsync(userId);

    if (!user) {
      throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);
    }

    const comparePasswords = await bcrpyt.compare(oldPassword, user.password);

    if (!comparePasswords) {
      throw new HttpError(Constants.WrongPassword, StatusCodes.BAD_GATEWAY);
    }

    const salt = await bcrpyt.genSalt(Environment.SALT);
    const hashedPassword = await bcrpyt.hash(newPassword, salt);

    user.password = hashedPassword;

    await _userService.updateAsync(user);

    res.status(StatusCodes.OK).json({ message: Constants.EntityUpdated });
  }
}
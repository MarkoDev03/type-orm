import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user-service";
import { HttpError } from "../errors/http-error";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/entities/user";
import { Enviroment } from "../configuration/enviroment";
import bcrpyt from "bcrypt";
import { MailSender } from "../utils/mail-sender";
import { CronJob } from "../utils/cron-job";
import { UserTokenService } from "../services/user-token-service";
import { v4 } from "uuid";
import { UserToken } from "../models/entities/user-token";
import { SettingsService } from "../services/settings-service";
import { SettingKeys } from "../configuration/setting-keys";
import { IAuthUser } from "../models/auth-user";

const _userService = new UserService();
const _userTokenService = new UserTokenService();
const _settingsService = new SettingsService();

export class AccountController {

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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

      const salt = await bcrpyt.genSalt(Enviroment.SALT);
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

      res.status(StatusCodes.OK).json({ message: Constants.AccountCreated });
    } catch (error) {
      next(error);
    }
  }

  async info(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.user as IAuthUser;
      const entity = await _userService.getByIdAsync(userId);

      if (!entity)
        throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);

      res.status(StatusCodes.OK).json(entity);
    } catch (error) {
      next(error);
    }
  }

  async verifyAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.params.token;

      const userToken = await _userTokenService.getByTokenAsync(token);
      const user = await _userService.getByIdAsync(userToken.userId);

      user.isVerified = true;

      await _userService.updateAsync(user);
      await _userTokenService.deleteAsync(userToken.id);

      res.status(StatusCodes.OK).json({ message: Constants.AccountVerified });
    } catch (error) {
      next(error);
    }
  }
}
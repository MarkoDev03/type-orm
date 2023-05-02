import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user-service";
import { HttpError } from "../errors/http-error";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { Identity } from "../helpers/identity-helper";
import { SettingsService } from "../services/settings-service";
import { SettingKeys } from "../configuration/setting-keys";
import { Enviroment } from "../configuration/enviroment";
import Logger from "../core/logger";

const _userService = new UserService();
const _settingsService = new SettingsService();

export class AuthController {
  public async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, password } = req.body;

    const user = await _userService.getByUsernameAsync(username);

    if (!user) {
      throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);
    }

    const comparePasswords = await bcrypt.compare(password, user.password);

    if (!comparePasswords) {
      throw new HttpError(Constants.WrongPassword, StatusCodes.BAD_GATEWAY);
    }

    const authUser: any = { ...user };
    delete authUser.password;
    delete authUser.id;

    authUser.userId = user.id;

    const tokenExpTime = await _settingsService.getByKeyAsync<string>(SettingKeys.AuthSessionExpTime) ?? Enviroment.AUTH_SESSION_EXP_TIME;
    const refreshTokenExpTime = await _settingsService.getByKeyAsync<string>(SettingKeys.AuthRefreshExpTime) ?? Enviroment.AUTH_SESSION_EXP_TIME;

    const accessToken = Identity.generate(authUser, tokenExpTime);
    const refreshToken = Identity.generate({ userId: authUser.id }, refreshTokenExpTime);

    Logger.info(Constants.AuthenticatedUser + authUser.id);

    res.status(StatusCodes.OK).json({ accessToken, refreshToken });
  }
}
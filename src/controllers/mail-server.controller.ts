import { NextFunction, Request, Response } from "express";
import { MailServerService } from "../services/mail-server-service";
import { MailServer } from "../models/entities/mail-server";
import validateMail from "email-validator";
import { HttpError } from "../errors/http-error";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";
import { SettingsService } from "../services/settings-service";
import { SettingKeys } from "../configuration/setting-keys";
import { CronJob } from "../utils/cron-job";
import { MailSender } from "../utils/mail-sender";

const _mailServerService = new MailServerService();
const _settingsService = new SettingsService();

export class MailServerController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const mailServer = req.body as MailServer;

    const isEmailValid = validateMail.validate(mailServer.senderMail);

    if (!isEmailValid) {
      throw new HttpError(Constants.InvalidMail, StatusCodes.BAD_REQUEST);
    }

    const isServerTaken = await _mailServerService.isServerTaken(mailServer.senderMail, mailServer.host, mailServer.port);

    if (isServerTaken) {
      throw new HttpError(Constants.ServerIsTaken, StatusCodes.BAD_REQUEST);
    }

    mailServer.enabled = true;
    await _mailServerService.createAsync(mailServer);

    const adminEmail = await _settingsService.getByKeyAsync<string>(SettingKeys.AdminEmail);

    let isTested = false;

    if (adminEmail != null) {
      isTested = true;

      let task = MailSender.sendAsync(Constants.EntityCreated, Constants.EntityCreated, [adminEmail]);
      CronJob.executeNow(task);
    }

    res.status(StatusCodes.OK).json({ message: Constants.EntityCreated, isTested: isTested });
  }
}
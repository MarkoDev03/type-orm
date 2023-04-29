import nodemailer from "nodemailer";
import mailValidator from "email-validator";
import { ServiceUnavailable, InvalidArgumentError } from "../errors/server-errors";
import { Constants } from "../common/constants";
import { MailServerService } from "../services/mail-server-service";
import { SettingsService } from "../services/settings-service";
import { SettingKeys } from "../configuration/setting-keys";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Logger from "../core/logger";

const _mailServerService = new MailServerService();
const _settingsService = new SettingsService();

export class MailSender {
  public static async sendAsync(message: string, title: string, recipients: string[]): Promise<void> {

    const isAvailable = await _settingsService.getByKeyAsync<boolean>(SettingKeys.MailServerEnabled);

    if (!isAvailable) {
      throw new ServiceUnavailable();
    }

    recipients.forEach((email) => {
      let isValid = mailValidator.validate(email);

      if (!isValid) {
        throw new InvalidArgumentError(Constants.InvalidMail + email);
      }
    });

    const isMailServerEnabled = await _settingsService.getByKeyAsync<boolean>(SettingKeys.MailServerEnabled);
    const mailServer = await _mailServerService.getEnabledAsync();

    if (isMailServerEnabled && mailServer !== null) {

      const mailTransporter = nodemailer.createTransport({
        host: mailServer.host,
        port: mailServer.port,
        service: mailServer.serviceType,
        auth: {
          user: mailServer.senderMail,
          pass: mailServer.senderPassword
        },
        tls: {
          ciphers: "SSLv3",
          rejectUnauthorized: false,
        },
      });

      let listOfTasks = [];

      recipients.forEach((email) => {
        const mailMessage = {
          text: message,
          subject: title,
          from: mailServer.senderMail,
          to: email
        };

        let task = this.transportMailAsync(mailMessage, mailTransporter);
        listOfTasks.push(task);
      });

      await Promise.all(listOfTasks);
    }
  }

  private static async transportMailAsync(mailMessage: any, transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>): Promise<void> {
    const task = await transporter.sendMail(mailMessage);

    if (task.accepted.length > 0 && task.accepted[0] === mailMessage.to) {
      Logger.info(Constants.MailSentTo + mailMessage.to);
    }
  }
}
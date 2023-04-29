import { MailServer } from "../models/entities/mail-server";
import { GenericService } from "./generic-service";

export class MailServerService extends GenericService<MailServer> {
  constructor() {
    super(MailServer);
  }

  public async getEnabledAsync(): Promise<MailServer> {
    const mailServer = await this._dbSet.findOne({
      where: {
        enabled: true
      }
    });

    return mailServer;
  }
}
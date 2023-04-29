import { Settings } from "../models/entities/settings";
import { GenericService } from "./generic-service";

export class SettingsService extends GenericService<Settings> {
  constructor() {
    super(Settings);
  }

  public async getByKeyAsync<T>(key: string): Promise<T> {
    const setting = await this._dbSet.findOne({
      where: {
        key: key
      }
    });

    return setting.value as T;
  }
}
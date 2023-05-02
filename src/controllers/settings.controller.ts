import { NextFunction, Request, Response } from "express";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";
import { SettingsService } from "../services/settings-service";
import { Settings } from "../models/entities/settings";
import { HttpError } from "../errors/http-error";

const _settingsService = new SettingsService();

export class SettingsController {
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const settings = await _settingsService.getAllAsync();
    res.status(StatusCodes.OK).json(settings);
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.settingId;

    const setting = await _settingsService.getSettingByKeyAsync(id);

    if (setting == null) {
      throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json(setting);
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const setting = req.body as Settings;

    const entityExist = await _settingsService.getByKeyAsync<any>(setting.key);

    if (entityExist != null) {
      throw new HttpError(Constants.EntityAlreadyExist, StatusCodes.BAD_GATEWAY);
    }

    await _settingsService.createAsync(setting);

    res.status(StatusCodes.OK).json({ message: Constants.EntityCreated });
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const setting = req.body as Settings;

    const entityExist = await _settingsService.getByKeyAsync<any>(setting.key);

    if (entityExist == null) {
      throw new HttpError(Constants.EntityNotFound, StatusCodes.BAD_GATEWAY);
    }

    await _settingsService.updateAsync(setting);

    res.status(StatusCodes.OK).json({ message: Constants.EntityUpdated });
  }
}
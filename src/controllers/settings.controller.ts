import { NextFunction, Request, Response } from "express";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";
import { SettingsService } from "../services/settings-service";
import { Settings } from "../models/entities/settings";

const _settingsService = new SettingsService();

export class SettingsController {
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await _settingsService.getAllAsync();
      res.status(StatusCodes.OK).json(settings);
    } catch (error) {
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const setting = await _settingsService.getByIdAsync(id);
      res.status(StatusCodes.OK).json(setting);
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const setting = req.body as Settings;
      await _settingsService.createAsync(setting);

      res.status(StatusCodes.OK).json({ message: Constants.EntityCreated });
    } catch (error) {
      next(error);
    }
  }
}
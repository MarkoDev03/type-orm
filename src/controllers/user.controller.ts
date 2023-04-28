import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user-service";
import { HttpError } from "../errors/http-error";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/entities/user";
import bcrpyt from "bcrypt";
import { Enviroment } from "../common/enviroment";


const _userService = new UserService();

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let users = await _userService.getAllAsync();
    res.status(StatusCodes.OK).json(users);
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const entity = await _userService.getByIdAsync(id);

      if (!entity)
        throw new HttpError(Constants.EntityNotFound, StatusCodes.NOT_FOUND);

      res.status(StatusCodes.OK).json(entity);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entity = req.body as User;

      entity.timeCreated = new Date();

      const salt = await bcrpyt.genSalt(Enviroment.SALT);
      const hashedPassword = await bcrpyt.hash(entity.password, salt);
      entity.password = hashedPassword;

      const model = await _userService.createAsync(entity);

      res.status(StatusCodes.OK).json(model);
    } catch (error) {
      next(error);
    }
  }
}
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user-service";

const _userService = new UserService();

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let users = await _userService.getAllAsync();
    res.status(200).json(users);
  }
}
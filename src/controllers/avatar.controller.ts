import { Request, Response, NextFunction } from "express";
import { IAuthUser } from "../models/auth-user";
import { AvatarService } from "../services/avatar-service";

const _avatarService = new AvatarService();

export class AvatarController {
  public async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
     const file = req.file;
     const { userId } = req.user as IAuthUser;

  }
}
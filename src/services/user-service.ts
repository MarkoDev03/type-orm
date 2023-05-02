import { User } from "../models/entities/user";
import { GenericService } from "./generic-service";
import bcrypt from "bcrypt";

export class UserService extends GenericService<User> {
  constructor() {
    super(User);
  }

  public async isUsernameTakenAsync(username: string): Promise<boolean> {
    const entity = await this._dbSet.findOne({
      where: {
        username: username
      }
    });

    return entity !== null;
  }

  public async isEmailTakenAsync(email: string): Promise<boolean> {
    const entity = await this._dbSet.findOne({
      where: {
        email: email
      }
    });

    return entity !== null;
  }

  public async getByUsernameAsync(username: string): Promise<User | null> {
    const user = await this._dbSet.findOne({
      where: {
        username: username
      }
    });

    return user;
  }
}
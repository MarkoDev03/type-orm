import { User } from "../models/entities/user";
import { GenericService } from "./generic-service";

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
}
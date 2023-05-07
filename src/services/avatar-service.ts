import { Avatar } from "../models/entities/avatar";
import { GenericService } from "./generic-service";

export class AvatarService extends GenericService<Avatar> {
  constructor() {
    super(Avatar);
  }

  public async getByUserIdAsync(userId: number): Promise<Avatar> {
    const entity = await this._dbSet.findOne({
      where: {
        userId: userId
      }
    });

    return entity;
  }
}
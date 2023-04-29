import { UserToken } from "../models/entities/user-token";
import { GenericService } from "./generic-service";

export class UserTokenService extends GenericService<UserToken> {
  constructor() {
    super(UserToken);
  }

  public async isTokenValidAsync(token: string): Promise<boolean> {
    const entity = await this._dbSet.findOne({
      where: {
        token: token,
      }
    });

    if (entity != null && entity.expiresAt > new Date()) {
      return false;
    }

    return entity != null;
  }

  public async getByTokenAsync(token: string): Promise<UserToken> {
    const entity = await this._dbSet.findOne({
      where: {
        token: token,
      }
    });

    return entity;
  }
}
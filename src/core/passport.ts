import { ExtractJwt, Strategy, StrategyOptions, VerifiedCallback } from "passport-jwt";
import { Enviroment } from "../configuration/enviroment";
import { Unauthorized } from "../errors/auth-error";
import { UserService } from "../services/user-service";
import Logger from "./logger";
import { Constants } from "../common/constants";

const _userService = new UserService();

let options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Enviroment.JWT_KEY,
  ignoreExpiration: false,
  issuer: Enviroment.JWT_ISSUER,
  audience: Enviroment.JWT_AUDIENCE,
  algorithms: Enviroment.JWT_ALGORITHMS,
};

const verifyToken = async (payload: any, callback: VerifiedCallback) => {
  const userId = payload.userId;

  if (!userId)
    return callback(new Unauthorized(), false);

  const user = await _userService.getByIdAsync(userId);

  if (!user)
    return callback(new Unauthorized(), false);

  Logger.info(Constants.AuthenticatedUser + userId);
  return callback(null, user);
}

const authOptions = {
  session: false,
  failWithError: true,
};

const jwtStrategy = new Strategy(options, verifyToken);

export { jwtStrategy, authOptions };
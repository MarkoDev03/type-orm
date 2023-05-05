import { ExtractJwt, Strategy, StrategyOptions, VerifiedCallback } from "passport-jwt";
import { Environment } from "../configuration/environment";
import { Unauthorized } from "../errors/auth-error";
import { UserService } from "../services/user-service";
import Logger from "./logger";
import { Constants } from "../common/constants";

const _userService = new UserService();

let options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Environment.JWT_KEY,
  ignoreExpiration: false,
  issuer: Environment.JWT_ISSUER,
  audience: Environment.JWT_AUDIENCE,
  jsonWebTokenOptions: {
    allowInvalidAsymmetricKeyTypes: false,
    ignoreNotBefore: false
  }
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
import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { Enviroment } from "../configuration/enviroment";

export class Identity {

  private options: SignOptions = {
    algorithm: Enviroment.JWT_ALGORITHMS[0] as jsonwebtoken.Algorithm,
    issuer: Enviroment.JWT_ISSUER,
    audience: Enviroment.JWT_AUDIENCE,
    allowInsecureKeySizes: false,
    allowInvalidAsymmetricKeyTypes: false,
    encoding: "utf8",
    noTimestamp: false,
  }

  generate(user: object, expTime: string | number): string {
    const authOptions: SignOptions = { ...this.options };
    authOptions.expiresIn = expTime;

    return jsonwebtoken.sign(user, Enviroment.JWT_KEY, this.options);
  }

  decode<T>(token: string): T {
    return jsonwebtoken.decode(token) as T;
  }
}
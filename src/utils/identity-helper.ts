import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import { Environment } from "../configuration/environment";

export class Identity {

  private static options: SignOptions = {
    issuer: Environment.JWT_ISSUER,
    audience: Environment.JWT_AUDIENCE,
    allowInsecureKeySizes: false,
    allowInvalidAsymmetricKeyTypes: false,
    encoding: "utf8",
    noTimestamp: false,
  }

  public static generate(user: object, expTime: string | number): string {
    const authOptions: SignOptions = { ...this.options };
    authOptions.expiresIn = expTime;

    return jsonwebtoken.sign(user, Environment.JWT_KEY, this.options);
  }

  public static decode<T>(token: string): T {
    return jsonwebtoken.decode(token) as T;
  }
}
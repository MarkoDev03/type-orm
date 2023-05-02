import { StatusCodes } from "http-status-codes";
import { Constants } from "../common/constants";
import { IErrorModel } from "../models/error-model";
import { CustomError } from "./custom-error"

export class Unauthorized extends CustomError {
  constructor() {
    super(Constants.Unauthorized);

    this.statusCode = StatusCodes.UNAUTHORIZED;

    Object.setPrototypeOf(this, Unauthorized.prototype);
  }

  serializeErrors(): IErrorModel[] {
    return [{
      message: this.message,
      statusCode: this.statusCode,
      name: Unauthorized.name
    }];
  }
}
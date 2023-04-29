import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";
import { Constants } from "../common/constants";
import { IErrorModel } from "../models/error-model";
import { ValidationError } from "express-validator";

export class RequestValidationError extends CustomError {
  status = StatusCodes.BAD_REQUEST;

  constructor(public errors?: Partial<ValidationError>[]) {
    super(Constants.InvalidRequest);

    Object.setPrototypeOf(this, RequestValidationError.prototype);

    if (!this.errors) {
      this.errors = [
        {
          msg: "",
          nestedErrors: [],
          location: undefined,
          value: undefined,
        },
      ];
    }
  }

  serializeError(): Partial<IErrorModel>[] {
    return this.errors.map((err) => {
      const customError = { message: err.msg };

      return customError as Partial<IErrorModel>;
    });
  }
}
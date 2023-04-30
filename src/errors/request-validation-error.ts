import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";
import { Constants } from "../common/constants";
import { IErrorModel } from "../models/error-model";
import { ValidationError } from "express-validator";

export class RequestValidationError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;

  constructor(public errors?: ValidationError[]) {
    super(Constants.InvalidRequest);

    Object.setPrototypeOf(this, RequestValidationError.prototype);

    if (!this.errors) {
      this.errors = new Array<ValidationError>();
    }
  }

   serializeErrors(): Partial<IErrorModel>[] {
    return this.errors.map((err: any) => {
      const customError = { 
        message: err.msg, 
        name: RequestValidationError.name, 
        statusCode: StatusCodes.BAD_REQUEST, 
        field: err?.path ?? "",
        location: err?.location ?? ""
      };

      return customError as Partial<IErrorModel>;
    }) as Partial<IErrorModel>[];
  }
}
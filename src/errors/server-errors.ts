import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";
import { Constants } from "../common/constants";

export class InvalidArgumentError extends CustomError {
   statusCode = StatusCodes.BAD_REQUEST;

   constructor(public message: string) {
      super(message);

      Object.setPrototypeOf(this, InvalidArgumentError.prototype);
   }
}

export class ServiceUnavailable extends CustomError {
   statusCode = StatusCodes.SERVICE_UNAVAILABLE;

   constructor() {
      super(Constants.ServiceUnavailable);

      Object.setPrototypeOf(this, InvalidArgumentError.prototype);
   }
}
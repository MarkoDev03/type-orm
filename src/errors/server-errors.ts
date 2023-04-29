import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";

export class InvalidArgumentError extends CustomError {
   statusCode = StatusCodes.BAD_REQUEST;

   constructor(public message: string) {
      super(message);

      Object.setPrototypeOf(this, InvalidArgumentError.prototype);
   }
}
import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";
import { Constants } from "../common/constants";
import { IErrorModel } from "../models/error-model";

export class InvalidArgumentError extends CustomError {
   statusCode = StatusCodes.BAD_REQUEST;

   constructor(public message: string) {
      super(message);

      Object.setPrototypeOf(this, InvalidArgumentError.prototype);
   }

   serializeErrors(): IErrorModel[] {
      return [{ 
         message: this.message, 
         statusCode: this.statusCode, 
         name: InvalidArgumentError.name 
      }];
    }
}

export class ServiceUnavailable extends CustomError {
   statusCode = StatusCodes.SERVICE_UNAVAILABLE;

   constructor() {
      super(Constants.ServiceUnavailable);

      Object.setPrototypeOf(this, InvalidArgumentError.prototype);
   }

   serializeErrors(): IErrorModel[] {
      return [{ 
         message: this.message, 
         statusCode: this.statusCode, 
         name: ServiceUnavailable.name 
      }];
    }
}
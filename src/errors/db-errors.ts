import { StatusCodes } from "http-status-codes";
import { Constants } from "../common/constants";
import { CustomError } from "./custom-error"

export class EntityCreatingError extends CustomError {
  constructor() {
    super(Constants.FailedToCreateEntity);

    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    Object.setPrototypeOf(this, EntityCreatingError.prototype);
  }
}

export class EntityUpdateError extends CustomError {
  constructor() {
    super(Constants.UpdateFailed);

    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    Object.setPrototypeOf(this, EntityUpdateError.prototype);
  }
}
import { CustomError } from "./custom-error"

export class HttpError extends CustomError {
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
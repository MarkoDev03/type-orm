import { IErrorModel } from "../models/error-model";


export abstract class CustomError extends Error {
  message: string;
  statusCode: number;

  constructor(message: string) {
     super(message);

     this.message = message;
  }

  serializeErrors(): IErrorModel[] {
    return [{ message: this.message, statusCode: this.statusCode}]
  }
}
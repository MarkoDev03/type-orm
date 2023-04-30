import { IErrorModel } from "../models/error-model";

export abstract class CustomError extends Error {
  message: string;
  statusCode: number;

  constructor(message: string) {
     super(message);
     this.message = message;
  }

  abstract serializeErrors(): Partial<IErrorModel>[];
}
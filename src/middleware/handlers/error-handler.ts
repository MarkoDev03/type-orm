import { Request, Response, NextFunction } from "express";
import { HttpError } from "../../errors/http-error";
import Logger from "../../core/logger";
import { StatusCodes } from "http-status-codes";
import { Constants } from "../../common/constants";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  Logger.error(error);

  if (error instanceof HttpError) {
    const formatedError = error as HttpError;
    res.status(formatedError.statusCode).json(formatedError.serializeErrors());
    return next();
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([ 
  { message: Constants.InternalServerError, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }]);
  return next();
}
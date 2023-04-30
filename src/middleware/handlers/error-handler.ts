import { Request, Response, NextFunction } from "express";
import Logger from "../../core/logger";
import { StatusCodes } from "http-status-codes";
import { Constants } from "../../common/constants";
import { CustomError } from "../../errors/custom-error";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  Logger.error(error);

  if (error instanceof CustomError) {
    const formatedError = error as CustomError;
    res.status(formatedError.statusCode ?? StatusCodes.BAD_REQUEST).json(formatedError.serializeErrors());
    return next();
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([ 
  { message: Constants.InternalServerError, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }]);
  return next();
}
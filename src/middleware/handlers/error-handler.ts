import { Request, Response, NextFunction } from "express";
import Logger from "../../core/logger";
import { StatusCodes } from "http-status-codes";
import { Constants } from "../../common/constants";
import { CustomError } from "../../errors/custom-error";
import { Unauthorized } from "../../errors/auth-error";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  Logger.error(error);

  if (error instanceof CustomError) {
    res.status(error.statusCode ?? StatusCodes.BAD_REQUEST).json(error.serializeErrors());
    return next();
  }

  if (error.name == "AuthenticationError") {
    const authError = new Unauthorized();
    res.status(authError.statusCode).json(authError);
    return next();
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([
    { message: Constants.InternalServerError, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }]);
  return next();
}
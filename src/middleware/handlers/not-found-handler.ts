import { Request, Response, NextFunction } from "express";
import { HttpError } from "../../errors/http-error";
import { Constants } from "../../common/constants";
import { StatusCodes } from "http-status-codes";

export const notFoundHanlder = (req: Request, res: Response, next: NextFunction): void => {
   throw new HttpError(Constants.EndpointNotFound, StatusCodes.NOT_FOUND);
}
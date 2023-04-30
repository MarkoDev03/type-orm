import { NextFunction, Request, Response } from "express";
import toobusy from "toobusy-js";
import { HttpError } from "../errors/http-error";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";

export const trafficManagement = (req: Request, res: Response, next: NextFunction): void => {
   if (toobusy()) {
      throw new HttpError(Constants.ServerIsOverloaded, StatusCodes.SERVICE_UNAVAILABLE)
   }

   next();
}
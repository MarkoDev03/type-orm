import { CorsOptions } from "cors";
import { Enviroment } from "../common/enviroment";
import { HttpError } from "../errors/http-error";
import { Constants } from "../common/constants";
import { StatusCodes } from "http-status-codes";

export const corsFilter: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (!Enviroment.ALLOWED_ORIGINS.includes(origin)) {
      return callback(new HttpError(Constants.BlockedByCors, StatusCodes.METHOD_NOT_ALLOWED));
    }

    if (Enviroment.ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
  },
  optionsSuccessStatus: 200
}
import { IEnvVars } from "../models/env-vars";
import dotenv from "dotenv";
import { ServerModes } from "../common/enums";

dotenv.config();

export const Enviroment: IEnvVars = {
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_ENABLE_QUERY_LOGGING: Number(process.env.DB_ENABLE_QUERY_LOGGING) == 1,

  PORT: Number(process.env.PORT),

  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS.split(","),

  HTTP_PROXY: process.env.HTTP_PROXY,
  HTTPS_PROXY: process.env.HTTPS_PROXY,
  NO_PROXY: process.env.NO_PROXY,

  SERVER_MODE: Number(process.env.SERVER_MODE) as ServerModes,

  SALT: Number(process.env.SALT),

  MAX_REQUEST: Number(process.env.MAX_REQUEST),
  WINDOW_MINUTES: Number(process.env.WINDOW_MINUTES),

  JWT_KEY: process.env.JWT_KEY,
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,
  JWT_ALGORITHMS: process.env.JWT_ALGORITHMS.split(','),
  AUTH_SCHEMA: process.env.AUTH_SCHEMA
};
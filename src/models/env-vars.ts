import { ServerModes } from "../common/enums";

export interface IEnvVars {
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_ENABLE_QUERY_LOGGING: boolean;
  PORT: number;
  ALLOWED_ORIGINS: string[];
  HTTP_PROXY: string;
  HTTPS_PROXY: string;
  NO_PROXY: string;
  SERVER_MODE: ServerModes;
  SALT: number;
}
import "express-async-errors";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import methodOverride from "method-override";
import compression from "compression";
import hsts from "hsts";
import bodyParser from "body-parser";
import { Environment } from "./configuration/environment";
import Logger from "./core/logger";
import { routes } from "./middleware";
import { errorHandler } from "./middleware/handlers/error-handler";
import { httpLogger } from "./middleware/handlers/http-logger";
import { notFoundHanlder } from "./middleware/handlers/not-found-handler";
import { Constants } from "./common/constants";
import { corsFilter } from "./core/cors";
import { ServerModes } from "./common/enums";
import { bootstrap } from "global-agent";
import events from "events";
import { DatabaseStore } from "./core/db-store";
import limiter from "./core/rate-limiter";
import { trafficManagement } from "./core/traffic-management";
import { FileSystem } from "./utils/file-system";
import passport from "passport";
import { jwtStrategy } from "./core/passport";
import cookieParser from "cookie-parser";

const startServer = () => {
  Logger.warn(Constants.StaringUp);

  const app = express();
  const server = http.createServer(app);
  const port = Environment.PORT || 5000;

  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(helmet());
  app.use(cors(corsFilter));
  app.use(limiter)
  app.use(compression());
  app.use(hsts());
  app.use(httpLogger);
  app.use(trafficManagement);
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use("/api", routes);
  app.use(notFoundHanlder);
  app.use(errorHandler);

  passport.use(Environment.AUTH_SCHEMA, jwtStrategy);

  app.setMaxListeners(Infinity);
  server.setMaxListeners(Infinity);
  events.setMaxListeners(Infinity);

  DatabaseStore.init();
  FileSystem.init();

  process.on("unhandledRejection", (error) => Logger.error(error));

  if (Environment.SERVER_MODE == ServerModes.Production) {
    bootstrap();

    global.GLOBAL_AGENT.HTTP_PROXY = Environment.HTTP_PROXY;
    global.GLOBAL_AGENT.HTTPS_PROXY = Environment.HTTPS_PROXY;
    global.GLOBAL_AGENT.NO_PROXY = Environment.NO_PROXY;
  }

  server.listen(port, () => {
    Logger.info(Constants.ServerIsListening + port);
  });
};

startServer();
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import methodOverride from "method-override";
import compression from "compression";
import hsts from "hsts";
import bodyParser from "body-parser";
import { Enviroment } from "./common/enviroment";
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
import "express-async-errors";

const startServer = () => {
  Logger.warn(Constants.StaringUp);

  const app = express();
  const server = http.createServer(app);
  const port = Enviroment.PORT || 5000;

  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(helmet());
  app.use(cors(corsFilter));
  app.use(compression());
  app.use(hsts());
  app.use("/api", routes);
  app.use(httpLogger);
  app.use(notFoundHanlder);
  app.use(errorHandler);

  app.setMaxListeners(Infinity);
  server.setMaxListeners(Infinity);
  events.setMaxListeners(Infinity);

  DatabaseStore.init();

  process.on("unhandledRejection", (error) => Logger.error(error));

  if (Enviroment.SERVER_MODE == ServerModes.Production) {
    bootstrap();

    global.GLOBAL_AGENT.HTTP_PROXY = Enviroment.HTTP_PROXY;
    global.GLOBAL_AGENT.HTTPS_PROXY = Enviroment.HTTPS_PROXY;
    global.GLOBAL_AGENT.NO_PROXY = Enviroment.NO_PROXY;
  }

  server.listen(port, () => {
    Logger.info(Constants.ServerIsListening + port);
  });
};

startServer();
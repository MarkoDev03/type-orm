import morgan, { StreamOptions } from "morgan";
import Logger from "../../core/logger";

const stream: StreamOptions = {
  write: (message) => Logger.http(message.replace("\n", ""))
};

const httpLogger = morgan(":method :url :status :res[content-length] - :response-time ms", { stream });

export { httpLogger };
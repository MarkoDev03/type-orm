import winston from "winston";

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
  silly: "blue"
};

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  silly: 5
};

winston.addColors(colors)

const errorFormat = winston.format((log) => {
  if (log instanceof Error) {
    return Object.assign(
      {
        message: log.message,
        stack: log.stack
      },
      log)
  }

  return log;
})

const getLogTemplate = (log: winston.Logform.TransformableInfo): string => {
  return `${log.timestamp as string} ${log.level}: ${log.message} ${log?.stack != null ? '\n' + log.stack : ""}`
}

const format = winston.format.combine(
  errorFormat(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(getLogTemplate)
)

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(format, winston.format.colorize({ all: true }))
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({
    filename: "logs/all.log",
  }),
]

const Logger = winston.createLogger({
  levels,
  level: "debug",
  format,
  transports
})

export default Logger;
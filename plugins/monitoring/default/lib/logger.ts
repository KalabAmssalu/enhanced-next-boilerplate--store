import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    env: process.env.NODE_ENV,
    service: process.env.SERVICE_NAME || "next-app",
  },
});

// Structured logging helpers
export const loggers = {
  info: (message: string, data?: any) => logger.info(data, message),
  warn: (message: string, data?: any) => logger.warn(data, message),
  error: (message: string, error?: Error | any) => {
    if (error instanceof Error) {
      logger.error({ error: error.message, stack: error.stack }, message);
    } else {
      logger.error(error, message);
    }
  },
  debug: (message: string, data?: any) => logger.debug(data, message),
  trace: (message: string, data?: any) => logger.trace(data, message),
};

export default logger;

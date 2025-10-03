import { logger } from "@KalabAmssalu/logger";

// Initialize logger with custom configuration
export const initLogger = async () => {
  await logger.init();

  // Set custom prefix for your application
  logger.prefix = () => `[${new Date().toISOString()}]`;

  return logger;
};

// Export logger instance
export { logger };

// Example usage functions
export const logInfo = (message: string, ...args: unknown[]) => {
  logger.info(message, ...args);
};

export const logError = (message: string, ...args: unknown[]) => {
  logger.error(message, ...args);
};

export const logSuccess = (message: string, ...args: unknown[]) => {
  logger.success(message, ...args);
};

export const logWarning = (message: string, ...args: unknown[]) => {
  logger.warn(message, ...args);
};

export const logDebug = (message: string, ...args: unknown[]) => {
  logger.debug(message, ...args);
};

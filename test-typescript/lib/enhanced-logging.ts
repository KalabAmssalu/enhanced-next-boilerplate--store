import { logger } from "@KalabAmssalu/logger";
import { task } from "@KalabAmssalu/task";

// Enhanced logging system that combines logger and task functionality
export class EnhancedLogging {
  private static instance: EnhancedLogging;
  private isInitialized = false;

  static getInstance(): EnhancedLogging {
    if (!EnhancedLogging.instance) {
      EnhancedLogging.instance = new EnhancedLogging();
    }
    return EnhancedLogging.instance;
  }

  async init() {
    if (this.isInitialized) return;

    await logger.init();
    logger.prefix = () => `[${new Date().toISOString()}]`;
    this.isInitialized = true;
  }

  // Logger methods
  log(message: string, ...args: unknown[]) {
    logger.log(message, ...args);
  }

  info(message: string, ...args: unknown[]) {
    logger.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]) {
    logger.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]) {
    logger.error(message, ...args);
  }

  success(message: string, ...args: unknown[]) {
    logger.success(message, ...args);
  }

  debug(message: string, ...args: unknown[]) {
    logger.debug(message, ...args);
  }

  // Task methods
  async startTask(
    name: string,
    options?: {
      successMessage?: string;
      maxLines?: number;
      noClear?: boolean;
    }
  ) {
    return await task.startTask({ name, ...options });
  }

  // Combined functionality: Task with automatic logging
  async runTaskWithLogging<T>(
    taskName: string,
    taskFunction: (task: any) => Promise<T>,
    options?: {
      successMessage?: string;
      maxLines?: number;
      noClear?: boolean;
    }
  ): Promise<T> {
    this.info(`Starting task: ${taskName}`);

    const taskInstance = await this.startTask(taskName, options);

    try {
      const result = await taskFunction(taskInstance);
      taskInstance.stop(
        options?.successMessage || `${taskName} completed successfully`
      );
      this.success(`Task completed: ${taskName}`);
      return result;
    } catch (error) {
      taskInstance.error(`Error in ${taskName}: ${error}`);
      taskInstance.stop(`${taskName} failed`);
      this.error(`Task failed: ${taskName}`, error);
      throw error;
    }
  }

  // Performance tracking
  async trackPerformance<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    this.info(`Starting performance tracking: ${operationName}`);

    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      this.success(`${operationName} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(`${operationName} failed after ${duration}ms`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const enhancedLogging = EnhancedLogging.getInstance();

// Export individual components
export { logger, task };

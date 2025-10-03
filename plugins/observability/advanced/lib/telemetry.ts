import { trace, context, SpanStatusCode, SpanKind } from "@opentelemetry/api";
import { logger } from "@KalabAmssalu/logger";
import { task } from "@KalabAmssalu/task";

export interface TelemetryConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  jaegerEndpoint?: string;
  prometheusPort?: number;
}

export interface TelemetrySpan {
  name: string;
  kind: SpanKind;
  attributes?: Record<string, any>;
  events?: Array<{
    name: string;
    attributes?: Record<string, any>;
    timestamp?: number;
  }>;
}

export class TelemetryManager {
  private static instance: TelemetryManager;
  private tracer: any;
  private config: TelemetryConfig;

  private constructor(config: TelemetryConfig) {
    this.config = config;
    this.tracer = trace.getTracer(config.serviceName, config.serviceVersion);
  }

  public static getInstance(config?: TelemetryConfig): TelemetryManager {
    if (!TelemetryManager.instance && config) {
      TelemetryManager.instance = new TelemetryManager(config);
    }
    return TelemetryManager.instance;
  }

  public createSpan(
    name: string,
    options?: {
      kind?: SpanKind;
      attributes?: Record<string, any>;
    }
  ): any {
    const span = this.tracer.startSpan(name, {
      kind: options?.kind || SpanKind.INTERNAL,
      attributes: {
        "service.name": this.config.serviceName,
        "service.version": this.config.serviceVersion,
        "service.environment": this.config.environment,
        ...options?.attributes,
      },
    });

    return span;
  }

  public async withSpan<T>(
    name: string,
    fn: (span: any) => Promise<T> | T,
    options?: {
      kind?: SpanKind;
      attributes?: Record<string, any>;
    }
  ): Promise<T> {
    const span = this.createSpan(name, options);

    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      span.recordException(
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    } finally {
      span.end();
    }
  }

  public addSpanEvent(
    span: any,
    name: string,
    attributes?: Record<string, any>
  ): void {
    span.addEvent(name, attributes);
  }

  public setSpanAttributes(span: any, attributes: Record<string, any>): void {
    span.setAttributes(attributes);
  }

  public getCurrentSpan(): any {
    return trace.getActiveSpan();
  }

  public runInContext<T>(fn: () => T, span?: any): T {
    const activeSpan = span || this.getCurrentSpan();
    if (activeSpan) {
      return context.with(trace.setSpan(context.active(), activeSpan), fn);
    }
    return fn();
  }

  public async trackAsyncOperation<T>(
    operationName: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const trackTask = task(`Tracking operation: ${operationName}`);

    try {
      trackTask.start("Starting operation tracking...");

      const result = await this.withSpan(
        operationName,
        async (span) => {
          if (metadata) {
            this.setSpanAttributes(span, metadata);
          }

          this.addSpanEvent(span, "operation.started", {
            timestamp: Date.now(),
            ...metadata,
          });

          const startTime = Date.now();
          const result = await operation();
          const duration = Date.now() - startTime;

          this.addSpanEvent(span, "operation.completed", {
            duration,
            timestamp: Date.now(),
          });

          this.setSpanAttributes(span, {
            "operation.duration": duration,
            "operation.success": true,
          });

          return result;
        },
        {
          kind: SpanKind.INTERNAL,
          attributes: {
            "operation.name": operationName,
            ...metadata,
          },
        }
      );

      trackTask.succeed(`Operation ${operationName} completed successfully`);
      return result;
    } catch (error) {
      trackTask.fail(`Operation ${operationName} failed`);
      logger.error(`Operation ${operationName} failed:`, error);
      throw error;
    }
  }

  public trackPerformance(
    name: string,
    startTime: number,
    metadata?: Record<string, any>
  ): void {
    const duration = Date.now() - startTime;
    const span = this.getCurrentSpan();

    if (span) {
      this.addSpanEvent(span, "performance.measurement", {
        name,
        duration,
        timestamp: Date.now(),
        ...metadata,
      });

      this.setSpanAttributes(span, {
        [`performance.${name}.duration`]: duration,
        ...metadata,
      });
    }

    logger.debug(`Performance: ${name} took ${duration}ms`, metadata);
  }

  public trackUserAction(
    action: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    const span = this.getCurrentSpan();

    if (span) {
      this.addSpanEvent(span, "user.action", {
        action,
        userId,
        timestamp: Date.now(),
        ...metadata,
      });

      this.setSpanAttributes(span, {
        "user.action": action,
        "user.id": userId,
        ...metadata,
      });
    }

    logger.info(`User action: ${action}`, { userId, ...metadata });
  }

  public trackError(error: Error, context?: Record<string, any>): void {
    const span = this.getCurrentSpan();

    if (span) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });

      this.addSpanEvent(span, "error.occurred", {
        error: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        ...context,
      });
    }

    logger.error("Error tracked:", error, context);
  }

  public trackBusinessEvent(
    eventName: string,
    properties?: Record<string, any>
  ): void {
    const span = this.getCurrentSpan();

    if (span) {
      this.addSpanEvent(span, "business.event", {
        event: eventName,
        timestamp: Date.now(),
        ...properties,
      });

      this.setSpanAttributes(span, {
        "business.event": eventName,
        ...properties,
      });
    }

    logger.info(`Business event: ${eventName}`, properties);
  }
}

// Utility functions for common telemetry operations
export const telemetry = {
  trackApiCall: async <T>(
    endpoint: string,
    method: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const manager = TelemetryManager.getInstance();
    return manager.trackAsyncOperation(
      `api.${method.toLowerCase()}.${endpoint}`,
      operation,
      {
        "http.method": method,
        "http.url": endpoint,
      }
    );
  },

  trackDatabaseQuery: async <T>(
    query: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const manager = TelemetryManager.getInstance();
    return manager.trackAsyncOperation("database.query", operation, {
      "db.statement": query,
      "db.operation": "query",
    });
  },

  trackExternalService: async <T>(
    serviceName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const manager = TelemetryManager.getInstance();
    return manager.trackAsyncOperation(`external.${serviceName}`, operation, {
      "external.service": serviceName,
    });
  },
};

// Performance measurement decorator
export function measurePerformance(name?: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    const operationName = name || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const manager = TelemetryManager.getInstance();
      const startTime = Date.now();

      try {
        const result = await method.apply(this, args);
        manager.trackPerformance(operationName, startTime);
        return result;
      } catch (error) {
        manager.trackPerformance(operationName, startTime, { error: true });
        throw error;
      }
    };
  };
}

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { logger } from "@KalabAmssalu/logger";
import { task } from "@KalabAmssalu/task";

export interface TracingConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  jaegerEndpoint?: string;
  samplingRatio?: number;
  enableAutoInstrumentation?: boolean;
}

export class TracingManager {
  private static instance: TracingManager;
  private sdk: NodeSDK | null = null;
  private config: TracingConfig;

  private constructor(config: TracingConfig) {
    this.config = config;
  }

  public static getInstance(config?: TracingConfig): TracingManager {
    if (!TracingManager.instance && config) {
      TracingManager.instance = new TracingManager(config);
    }
    return TracingManager.instance;
  }

  public async initialize(): Promise<void> {
    const initTask = task("Initializing distributed tracing");

    try {
      initTask.start("Setting up OpenTelemetry tracing...");

      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]:
          this.config.serviceVersion,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
          this.config.environment,
      });

      const jaegerExporter = new JaegerExporter({
        endpoint:
          this.config.jaegerEndpoint || "http://localhost:14268/api/traces",
      });

      const instrumentations =
        this.config.enableAutoInstrumentation !== false
          ? getNodeAutoInstrumentations({
              "@opentelemetry/instrumentation-fs": {
                enabled: false, // Disable file system instrumentation in production
              },
              "@opentelemetry/instrumentation-http": {
                enabled: true,
                requestHook: (span, request) => {
                  span.setAttributes({
                    "http.request.headers": JSON.stringify(request.headers),
                  });
                },
                responseHook: (span, response) => {
                  span.setAttributes({
                    "http.response.headers": JSON.stringify(response.headers),
                  });
                },
              },
              "@opentelemetry/instrumentation-express": {
                enabled: true,
              },
            })
          : [];

      this.sdk = new NodeSDK({
        resource,
        traceExporter: jaegerExporter,
        instrumentations,
        sampler: {
          shouldSample: () => {
            // Simple sampling based on ratio
            return Math.random() < (this.config.samplingRatio || 0.1);
          },
        },
      });

      this.sdk.start();

      initTask.succeed("Distributed tracing initialized successfully");
      logger.success("🔍 Distributed tracing is now active");
      logger.info(
        `📊 Traces will be sent to: ${
          this.config.jaegerEndpoint || "http://localhost:14268/api/traces"
        }`
      );
    } catch (error) {
      initTask.fail("Failed to initialize distributed tracing");
      logger.error("Tracing initialization error:", error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    const shutdownTask = task("Shutting down distributed tracing");

    try {
      shutdownTask.start("Stopping OpenTelemetry SDK...");

      if (this.sdk) {
        await this.sdk.shutdown();
        this.sdk = null;
      }

      shutdownTask.succeed("Distributed tracing shutdown completed");
      logger.info("Distributed tracing has been shut down");
    } catch (error) {
      shutdownTask.fail("Failed to shutdown distributed tracing");
      logger.error("Tracing shutdown error:", error);
      throw error;
    }
  }

  public isInitialized(): boolean {
    return this.sdk !== null;
  }

  public getConfig(): TracingConfig {
    return { ...this.config };
  }
}

// Custom span decorators for common operations
export function traceMethod(operationName?: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    const spanName =
      operationName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const { trace } = await import("@opentelemetry/api");
      const tracer = trace.getTracer("custom-tracer");
      const span = tracer.startSpan(spanName);

      try {
        const result = await method.apply(this, args);
        span.setStatus({ code: 1 }); // OK
        return result;
      } catch (error) {
        span.setStatus({
          code: 2,
          message: error instanceof Error ? error.message : "Unknown error",
        }); // ERROR
        span.recordException(
          error instanceof Error ? error : new Error(String(error))
        );
        throw error;
      } finally {
        span.end();
      }
    };
  };
}

export function traceAsync(operationName: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const { trace } = await import("@opentelemetry/api");
      const tracer = trace.getTracer("async-tracer");

      return tracer.startActiveSpan(operationName, async (span) => {
        try {
          span.setAttributes({
            "operation.name": operationName,
            "operation.method": propertyName,
            "operation.class": target.constructor.name,
          });

          const result = await method.apply(this, args);
          span.setStatus({ code: 1 }); // OK
          return result;
        } catch (error) {
          span.setStatus({
            code: 2,
            message: error instanceof Error ? error.message : "Unknown error",
          }); // ERROR
          span.recordException(
            error instanceof Error ? error : new Error(String(error))
          );
          throw error;
        } finally {
          span.end();
        }
      });
    };
  };
}

// Utility functions for manual tracing
export const tracing = {
  startSpan: async (name: string, attributes?: Record<string, any>) => {
    const { trace } = await import("@opentelemetry/api");
    const tracer = trace.getTracer("manual-tracer");
    const span = tracer.startSpan(name);

    if (attributes) {
      span.setAttributes(attributes);
    }

    return span;
  },

  addSpanEvent: (span: any, name: string, attributes?: Record<string, any>) => {
    span.addEvent(name, attributes);
  },

  setSpanAttributes: (span: any, attributes: Record<string, any>) => {
    span.setAttributes(attributes);
  },

  endSpan: (span: any, status?: { code: number; message?: string }) => {
    if (status) {
      span.setStatus(status);
    }
    span.end();
  },

  recordException: (span: any, error: Error) => {
    span.recordException(error);
    span.setStatus({ code: 2, message: error.message }); // ERROR
  },
};

// Express middleware for request tracing
export const requestTracingMiddleware = (req: any, res: any, next: any) => {
  const { trace } = require("@opentelemetry/api");
  const tracer = trace.getTracer("express-tracer");

  const span = tracer.startSpan(`${req.method} ${req.path}`, {
    attributes: {
      "http.method": req.method,
      "http.url": req.url,
      "http.route": req.route?.path || req.path,
      "http.user_agent": req.get("User-Agent"),
      "http.request_id": req.headers["x-request-id"] || "unknown",
    },
  });

  // Add span to request context
  req.span = span;

  // Override res.end to close span
  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    span.setAttributes({
      "http.status_code": res.statusCode,
      "http.response_size": res.get("Content-Length") || 0,
    });

    if (res.statusCode >= 400) {
      span.setStatus({ code: 2, message: `HTTP ${res.statusCode}` }); // ERROR
    } else {
      span.setStatus({ code: 1 }); // OK
    }

    span.end();
    originalEnd.apply(this, args);
  };

  next();
};


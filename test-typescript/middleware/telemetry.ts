import { Request, Response, NextFunction } from "express";
import { TelemetryManager } from "../lib/telemetry";
import { MetricsManager } from "../lib/metrics";
import { logger } from "@KalabAmssalu/logger";

export interface TelemetryRequest extends Request {
  startTime?: number;
  span?: any;
  telemetry?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
  };
}

export const telemetryMiddleware = (
  req: TelemetryRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  req.startTime = startTime;

  // Extract telemetry context from headers
  req.telemetry = {
    userId: req.headers["x-user-id"] as string,
    sessionId: req.headers["x-session-id"] as string,
    requestId:
      (req.headers["x-request-id"] as string) ||
      `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  // Set request ID in response headers
  res.setHeader("X-Request-ID", req.telemetry.requestId);

  // Track request start
  const telemetryManager = TelemetryManager.getInstance();
  const metricsManager = MetricsManager.getInstance();

  if (telemetryManager) {
    telemetryManager.trackUserAction(
      "http.request.start",
      req.telemetry.userId,
      {
        method: req.method,
        path: req.path,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
        requestId: req.telemetry.requestId,
      }
    );
  }

  if (metricsManager) {
    metricsManager.incrementCounter("http_requests_total", {
      method: req.method,
      path: req.path,
      status: "pending",
    });
  }

  // Override res.end to track completion
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Track request completion
    if (telemetryManager) {
      telemetryManager.trackUserAction(
        "http.request.complete",
        req.telemetry?.userId,
        {
          method: req.method,
          path: req.path,
          statusCode,
          duration,
          requestId: req.telemetry?.requestId,
        }
      );

      if (statusCode >= 400) {
        telemetryManager.trackError(new Error(`HTTP ${statusCode}`), {
          method: req.method,
          path: req.path,
          statusCode,
          requestId: req.telemetry?.requestId,
        });
      }
    }

    if (metricsManager) {
      metricsManager.incrementCounter("http_requests_total", {
        method: req.method,
        path: req.path,
        status: statusCode.toString(),
      });

      metricsManager.observeHistogram(
        "http_request_duration_seconds",
        duration / 1000,
        {
          method: req.method,
          path: req.path,
        }
      );

      // Track response size if available
      const contentLength = res.get("Content-Length");
      if (contentLength) {
        metricsManager.observeHistogram(
          "http_response_size_bytes",
          parseInt(contentLength),
          {
            method: req.method,
            path: req.path,
          }
        );
      }
    }

    // Log request completion
    logger.info(
      `HTTP ${req.method} ${req.path} - ${statusCode} (${duration}ms)`,
      {
        requestId: req.telemetry?.requestId,
        userId: req.telemetry?.userId,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
      }
    );

    // Call original end method
    originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

export const errorTelemetryMiddleware = (
  error: Error,
  req: TelemetryRequest,
  res: Response,
  next: NextFunction
) => {
  const telemetryManager = TelemetryManager.getInstance();
  const metricsManager = MetricsManager.getInstance();

  // Track error
  if (telemetryManager) {
    telemetryManager.trackError(error, {
      method: req.method,
      path: req.path,
      requestId: req.telemetry?.requestId,
      userId: req.telemetry?.userId,
    });
  }

  if (metricsManager) {
    metricsManager.incrementCounter("errors_total", {
      type: error.constructor.name,
      severity: "error",
    });
  }

  // Log error
  logger.error(`Request error: ${error.message}`, {
    error: error.stack,
    method: req.method,
    path: req.path,
    requestId: req.telemetry?.requestId,
    userId: req.telemetry?.userId,
  });

  next(error);
};

export const performanceMiddleware = (
  req: TelemetryRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds

    const telemetryManager = TelemetryManager.getInstance();
    if (telemetryManager) {
      telemetryManager.trackPerformance(
        `http.${req.method.toLowerCase()}.${req.path}`,
        Date.now() - (req.startTime || Date.now()),
        {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
        }
      );
    }
  });

  next();
};

export const businessMetricsMiddleware = (
  req: TelemetryRequest,
  res: Response,
  next: NextFunction
) => {
  // Track business-specific metrics based on route
  const businessRoutes = {
    "/api/auth/register": "user_registration",
    "/api/auth/login": "user_login",
    "/api/orders": "order_operation",
    "/api/payments": "payment_operation",
    "/api/analytics": "analytics_request",
  };

  const businessEvent = businessRoutes[req.path as keyof typeof businessRoutes];

  if (businessEvent) {
    const telemetryManager = TelemetryManager.getInstance();
    const metricsManager = MetricsManager.getInstance();

    res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        if (telemetryManager) {
          telemetryManager.trackBusinessEvent(businessEvent, {
            method: req.method,
            path: req.path,
            userId: req.telemetry?.userId,
            requestId: req.telemetry?.requestId,
          });
        }

        if (metricsManager) {
          metricsManager.incrementCounter(`business_${businessEvent}_total`, {
            method: req.method,
            path: req.path,
          });
        }
      }
    });
  }

  next();
};


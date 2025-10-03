import {
  register,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} from "prom-client";
import { logger } from "@KalabAmssalu/logger";
import { task } from "@KalabAmssalu/task";

export interface MetricsConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  port?: number;
  path?: string;
  collectDefaultMetrics?: boolean;
}

export interface MetricLabels {
  [key: string]: string | number;
}

export class MetricsManager {
  private static instance: MetricsManager;
  private config: MetricsConfig;
  private metrics: Map<string, any> = new Map();
  private server: any = null;

  private constructor(config: MetricsConfig) {
    this.config = config;

    if (config.collectDefaultMetrics !== false) {
      collectDefaultMetrics({
        prefix: `${config.serviceName}_`,
        gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
      });
    }
  }

  public static getInstance(config?: MetricsConfig): MetricsManager {
    if (!MetricsManager.instance && config) {
      MetricsManager.instance = new MetricsManager(config);
    }
    return MetricsManager.instance;
  }

  public createCounter(
    name: string,
    help: string,
    labelNames: string[] = []
  ): Counter {
    const counter = new Counter({
      name: `${this.config.serviceName}_${name}`,
      help,
      labelNames,
      registers: [register],
    });

    this.metrics.set(name, counter);
    return counter;
  }

  public createHistogram(
    name: string,
    help: string,
    labelNames: string[] = [],
    buckets?: number[]
  ): Histogram {
    const histogram = new Histogram({
      name: `${this.config.serviceName}_${name}`,
      help,
      labelNames,
      buckets: buckets || [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120, 300],
      registers: [register],
    });

    this.metrics.set(name, histogram);
    return histogram;
  }

  public createGauge(
    name: string,
    help: string,
    labelNames: string[] = []
  ): Gauge {
    const gauge = new Gauge({
      name: `${this.config.serviceName}_${name}`,
      help,
      labelNames,
      registers: [register],
    });

    this.metrics.set(name, gauge);
    return gauge;
  }

  public getMetric(name: string): any {
    return this.metrics.get(name);
  }

  public incrementCounter(
    name: string,
    labels?: MetricLabels,
    value: number = 1
  ): void {
    const counter = this.getMetric(name);
    if (counter) {
      counter.inc(labels, value);
    } else {
      logger.warn(`Counter metric '${name}' not found`);
    }
  }

  public observeHistogram(
    name: string,
    value: number,
    labels?: MetricLabels
  ): void {
    const histogram = this.getMetric(name);
    if (histogram) {
      histogram.observe(labels, value);
    } else {
      logger.warn(`Histogram metric '${name}' not found`);
    }
  }

  public setGauge(name: string, value: number, labels?: MetricLabels): void {
    const gauge = this.getMetric(name);
    if (gauge) {
      gauge.set(labels, value);
    } else {
      logger.warn(`Gauge metric '${name}' not found`);
    }
  }

  public async startMetricsServer(): Promise<void> {
    const startTask = task("Starting metrics server");

    try {
      startTask.start("Setting up Prometheus metrics endpoint...");

      const express = require("express");
      const app = express();

      app.get(this.config.path || "/metrics", async (req: any, res: any) => {
        try {
          res.set("Content-Type", register.contentType);
          const metrics = await register.metrics();
          res.end(metrics);
        } catch (error) {
          logger.error("Error generating metrics:", error);
          res.status(500).end("Error generating metrics");
        }
      });

      app.get("/health", (req: any, res: any) => {
        res.json({
          status: "healthy",
          service: this.config.serviceName,
          version: this.config.serviceVersion,
          environment: this.config.environment,
          timestamp: new Date().toISOString(),
        });
      });

      const port = this.config.port || 9090;

      this.server = app.listen(port, () => {
        startTask.succeed(`Metrics server started on port ${port}`);
        logger.success(
          `📊 Metrics available at: http://localhost:${port}${
            this.config.path || "/metrics"
          }`
        );
        logger.info(
          `🔍 Health check available at: http://localhost:${port}/health`
        );
      });
    } catch (error) {
      startTask.fail("Failed to start metrics server");
      logger.error("Metrics server error:", error);
      throw error;
    }
  }

  public async stopMetricsServer(): Promise<void> {
    const stopTask = task("Stopping metrics server");

    try {
      stopTask.start("Shutting down metrics server...");

      if (this.server) {
        await new Promise<void>((resolve, reject) => {
          this.server.close((err?: Error) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        this.server = null;
      }

      stopTask.succeed("Metrics server stopped");
      logger.info("Metrics server has been stopped");
    } catch (error) {
      stopTask.fail("Failed to stop metrics server");
      logger.error("Error stopping metrics server:", error);
      throw error;
    }
  }

  public getMetrics(): Promise<string> {
    return register.metrics();
  }

  public clearMetrics(): void {
    register.clear();
    this.metrics.clear();
  }
}

// Predefined common metrics
export const commonMetrics = {
  // HTTP metrics
  httpRequestsTotal: "http_requests_total",
  httpRequestDuration: "http_request_duration_seconds",
  httpRequestSize: "http_request_size_bytes",
  httpResponseSize: "http_response_size_bytes",

  // Database metrics
  dbConnectionsActive: "db_connections_active",
  dbQueriesTotal: "db_queries_total",
  dbQueryDuration: "db_query_duration_seconds",

  // Business metrics
  userRegistrations: "user_registrations_total",
  userLogins: "user_logins_total",
  ordersCreated: "orders_created_total",
  revenue: "revenue_total",

  // System metrics
  memoryUsage: "memory_usage_bytes",
  cpuUsage: "cpu_usage_percent",
  diskUsage: "disk_usage_bytes",
};

// Utility functions for common metric operations
export const metrics = {
  trackHttpRequest: (
    method: string,
    path: string,
    statusCode: number,
    duration: number
  ) => {
    const manager = MetricsManager.getInstance();
    manager.incrementCounter(commonMetrics.httpRequestsTotal, {
      method,
      path,
      status: statusCode.toString(),
    });
    manager.observeHistogram(
      commonMetrics.httpRequestDuration,
      duration / 1000,
      {
        method,
        path,
      }
    );
  },

  trackDatabaseQuery: (query: string, duration: number, success: boolean) => {
    const manager = MetricsManager.getInstance();
    manager.incrementCounter(commonMetrics.dbQueriesTotal, {
      query: query.substring(0, 50), // Truncate long queries
      success: success.toString(),
    });
    manager.observeHistogram(commonMetrics.dbQueryDuration, duration / 1000, {
      query: query.substring(0, 50),
    });
  },

  trackUserAction: (action: string, userId?: string) => {
    const manager = MetricsManager.getInstance();
    manager.incrementCounter("user_actions_total", {
      action,
      user_id: userId || "anonymous",
    });
  },

  trackBusinessEvent: (event: string, value?: number) => {
    const manager = MetricsManager.getInstance();
    manager.incrementCounter("business_events_total", {
      event,
    });

    if (value !== undefined) {
      manager.incrementCounter(
        "business_events_value_total",
        {
          event,
        },
        value
      );
    }
  },

  setSystemMetric: (metric: string, value: number) => {
    const manager = MetricsManager.getInstance();
    manager.setGauge(metric, value);
  },
};

// Performance measurement decorator with metrics
export function measureMetrics(metricName: string, labels?: MetricLabels) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const manager = MetricsManager.getInstance();
      const startTime = Date.now();

      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;

        manager.observeHistogram(metricName, duration / 1000, {
          ...labels,
          success: "true",
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        manager.observeHistogram(metricName, duration / 1000, {
          ...labels,
          success: "false",
          error: error instanceof Error ? error.constructor.name : "Unknown",
        });

        throw error;
      }
    };
  };
}


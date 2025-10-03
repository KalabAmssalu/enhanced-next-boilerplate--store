import { TracingManager } from "./tracing";
import { MetricsManager } from "./metrics";
import { TelemetryManager } from "./telemetry";
import { logger } from "@KalabAmssalu/logger";
import { task } from "@KalabAmssalu/task";

export interface ObservabilityConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  jaegerEndpoint?: string;
  metricsPort?: number;
  metricsPath?: string;
  samplingRatio?: number;
  enableTracing?: boolean;
  enableMetrics?: boolean;
  enableTelemetry?: boolean;
}

export class ObservabilitySetup {
  private static instance: ObservabilitySetup;
  private config: ObservabilityConfig;
  private tracingManager: TracingManager | null = null;
  private metricsManager: MetricsManager | null = null;
  private telemetryManager: TelemetryManager | null = null;
  private isInitialized = false;

  private constructor(config: ObservabilityConfig) {
    this.config = config;
  }

  public static getInstance(config?: ObservabilityConfig): ObservabilitySetup {
    if (!ObservabilitySetup.instance && config) {
      ObservabilitySetup.instance = new ObservabilitySetup(config);
    }
    return ObservabilitySetup.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.warn("Observability is already initialized");
      return;
    }

    const initTask = task("Initializing observability stack");

    try {
      initTask.start("Setting up telemetry, tracing, and metrics...");

      // Initialize Telemetry Manager
      if (this.config.enableTelemetry !== false) {
        this.telemetryManager = TelemetryManager.getInstance({
          serviceName: this.config.serviceName,
          serviceVersion: this.config.serviceVersion,
          environment: this.config.environment,
          jaegerEndpoint: this.config.jaegerEndpoint,
          prometheusPort: this.config.metricsPort,
        });
        logger.info("✅ Telemetry manager initialized");
      }

      // Initialize Tracing Manager
      if (this.config.enableTracing !== false) {
        this.tracingManager = TracingManager.getInstance({
          serviceName: this.config.serviceName,
          serviceVersion: this.config.serviceVersion,
          environment: this.config.environment,
          jaegerEndpoint: this.config.jaegerEndpoint,
          samplingRatio: this.config.samplingRatio,
        });

        await this.tracingManager.initialize();
        logger.info("✅ Distributed tracing initialized");
      }

      // Initialize Metrics Manager
      if (this.config.enableMetrics !== false) {
        this.metricsManager = MetricsManager.getInstance({
          serviceName: this.config.serviceName,
          serviceVersion: this.config.serviceVersion,
          environment: this.config.environment,
          port: this.config.metricsPort,
          path: this.config.metricsPath,
        });

        // Create common metrics
        this.setupCommonMetrics();

        await this.metricsManager.startMetricsServer();
        logger.info("✅ Metrics server started");
      }

      this.isInitialized = true;
      initTask.succeed("Observability stack initialized successfully");

      logger.success("🔍 Observability stack is now active");
      logger.info(
        `📊 Service: ${this.config.serviceName} v${this.config.serviceVersion}`
      );
      logger.info(`🌍 Environment: ${this.config.environment}`);

      if (this.config.jaegerEndpoint) {
        logger.info(`🔍 Jaeger endpoint: ${this.config.jaegerEndpoint}`);
      }

      if (this.config.metricsPort) {
        logger.info(`📊 Metrics port: ${this.config.metricsPort}`);
      }
    } catch (error) {
      initTask.fail("Failed to initialize observability stack");
      logger.error("Observability initialization error:", error);
      throw error;
    }
  }

  private setupCommonMetrics(): void {
    if (!this.metricsManager) return;

    // HTTP metrics
    this.metricsManager.createCounter(
      "http_requests_total",
      "Total HTTP requests",
      ["method", "path", "status"]
    );
    this.metricsManager.createHistogram(
      "http_request_duration_seconds",
      "HTTP request duration",
      ["method", "path"]
    );
    this.metricsManager.createHistogram(
      "http_request_size_bytes",
      "HTTP request size",
      ["method", "path"]
    );
    this.metricsManager.createHistogram(
      "http_response_size_bytes",
      "HTTP response size",
      ["method", "path"]
    );

    // Database metrics
    this.metricsManager.createGauge(
      "db_connections_active",
      "Active database connections"
    );
    this.metricsManager.createCounter(
      "db_queries_total",
      "Total database queries",
      ["query", "success"]
    );
    this.metricsManager.createHistogram(
      "db_query_duration_seconds",
      "Database query duration",
      ["query"]
    );

    // Business metrics
    this.metricsManager.createCounter(
      "user_registrations_total",
      "Total user registrations"
    );
    this.metricsManager.createCounter(
      "user_logins_total",
      "Total user logins",
      ["method"]
    );
    this.metricsManager.createCounter(
      "orders_created_total",
      "Total orders created"
    );
    this.metricsManager.createCounter("revenue_total", "Total revenue", [
      "currency",
    ]);

    // System metrics
    this.metricsManager.createGauge(
      "memory_usage_bytes",
      "Memory usage in bytes"
    );
    this.metricsManager.createGauge(
      "cpu_usage_percent",
      "CPU usage percentage"
    );
    this.metricsManager.createGauge("disk_usage_bytes", "Disk usage in bytes");

    // Custom application metrics
    this.metricsManager.createCounter("api_calls_total", "Total API calls", [
      "endpoint",
      "method",
      "status",
    ]);
    this.metricsManager.createHistogram(
      "api_response_time_seconds",
      "API response time",
      ["endpoint", "method"]
    );
    this.metricsManager.createCounter("errors_total", "Total errors", [
      "type",
      "severity",
    ]);
    this.metricsManager.createCounter("cache_hits_total", "Total cache hits", [
      "cache_type",
    ]);
    this.metricsManager.createCounter(
      "cache_misses_total",
      "Total cache misses",
      ["cache_type"]
    );

    logger.info("📊 Common metrics created");
  }

  public async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      logger.warn("Observability is not initialized");
      return;
    }

    const shutdownTask = task("Shutting down observability stack");

    try {
      shutdownTask.start("Stopping telemetry, tracing, and metrics...");

      // Shutdown in reverse order
      if (this.metricsManager) {
        await this.metricsManager.stopMetricsServer();
        logger.info("✅ Metrics server stopped");
      }

      if (this.tracingManager) {
        await this.tracingManager.shutdown();
        logger.info("✅ Distributed tracing stopped");
      }

      this.isInitialized = false;
      shutdownTask.succeed("Observability stack shutdown completed");
      logger.info("Observability stack has been shut down");
    } catch (error) {
      shutdownTask.fail("Failed to shutdown observability stack");
      logger.error("Observability shutdown error:", error);
      throw error;
    }
  }

  public getTracingManager(): TracingManager | null {
    return this.tracingManager;
  }

  public getMetricsManager(): MetricsManager | null {
    return this.metricsManager;
  }

  public getTelemetryManager(): TelemetryManager | null {
    return this.telemetryManager;
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public getConfig(): ObservabilityConfig {
    return { ...this.config };
  }
}

// Default configuration based on environment
export const getDefaultConfig = (): ObservabilityConfig => {
  return {
    serviceName: process.env.SERVICE_NAME || "enterprise-app",
    serviceVersion: process.env.SERVICE_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    jaegerEndpoint:
      process.env.JAEGER_ENDPOINT || "http://localhost:14268/api/traces",
    metricsPort: parseInt(process.env.METRICS_PORT || "9090"),
    metricsPath: process.env.METRICS_PATH || "/metrics",
    samplingRatio: parseFloat(process.env.SAMPLING_RATIO || "0.1"),
    enableTracing: process.env.ENABLE_TRACING !== "false",
    enableMetrics: process.env.ENABLE_METRICS !== "false",
    enableTelemetry: process.env.ENABLE_TELEMETRY !== "false",
  };
};

// CLI interface for running observability setup
if (require.main === module) {
  const config = getDefaultConfig();
  const observability = ObservabilitySetup.getInstance(config);

  observability.initialize().catch((error) => {
    logger.error("Failed to initialize observability:", error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    logger.info("Received SIGINT, shutting down observability...");
    await observability.shutdown();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM, shutting down observability...");
    await observability.shutdown();
    process.exit(0);
  });
}

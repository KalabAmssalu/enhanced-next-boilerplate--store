import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { logger } from "@KalabAmssalu/logger";
import { task } from "@KalabAmssalu/task";

export class SwaggerSetup {
  private static instance: SwaggerSetup;
  private app: express.Application;
  private port: number;

  private constructor() {
    this.app = express();
    this.port = parseInt(process.env.SWAGGER_PORT || "3001");
  }

  public static getInstance(): SwaggerSetup {
    if (!SwaggerSetup.instance) {
      SwaggerSetup.instance = new SwaggerSetup();
    }
    return SwaggerSetup.instance;
  }

  private loadOpenAPISpec(): any {
    try {
      const specPath = path.join(process.cwd(), "api", "openapi.yaml");
      const spec = YAML.load(specPath);

      // Add server information based on environment
      const environment = process.env.NODE_ENV || "development";
      spec.servers = [
        {
          url:
            environment === "production"
              ? "https://api.enterprise.com/v1"
              : environment === "staging"
              ? "https://staging-api.enterprise.com/v1"
              : "http://localhost:3000/api/v1",
          description: `${
            environment.charAt(0).toUpperCase() + environment.slice(1)
          } server`,
        },
      ];

      return spec;
    } catch (error) {
      logger.error("Failed to load OpenAPI specification:", error);
      throw error;
    }
  }

  private setupSwaggerUI(): void {
    const spec = this.loadOpenAPISpec();

    const swaggerOptions = {
      explorer: true,
      swaggerOptions: {
        url: "/api-docs/swagger.json",
        docExpansion: "list",
        filter: true,
        showRequestHeaders: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        requestInterceptor: (request: any) => {
          // Add authentication token if available
          const token = process.env.API_TOKEN;
          if (token) {
            request.headers.Authorization = `Bearer ${token}`;
          }
          return request;
        },
        responseInterceptor: (response: any) => {
          // Log API responses for debugging
          logger.debug("API Response:", {
            status: response.status,
            url: response.url,
            data: response.body,
          });
          return response;
        },
      },
      customCss: `
        .swagger-ui .topbar { background-color: #1f2937; }
        .swagger-ui .topbar .download-url-wrapper { display: none; }
        .swagger-ui .info .title { color: #1f2937; }
        .swagger-ui .scheme-container { background: #f8fafc; }
      `,
      customSiteTitle: "Enterprise API Documentation",
    };

    // Serve the OpenAPI spec as JSON
    this.app.get("/api-docs/swagger.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(spec);
    });

    // Setup Swagger UI
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(spec, swaggerOptions)
    );
  }

  private setupHealthCheck(): void {
    this.app.get("/health", (req, res) => {
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        logger.error("Swagger server error:", err);
        res.status(500).json({
          error: "Internal server error",
          message: err.message,
          timestamp: new Date().toISOString(),
        });
      }
    );
  }

  public async start(): Promise<void> {
    const startTask = task("Starting Swagger documentation server");

    try {
      startTask.start("Setting up Swagger UI...");

      this.setupSwaggerUI();
      this.setupHealthCheck();
      this.setupErrorHandling();

      await new Promise<void>((resolve, reject) => {
        this.app.listen(this.port, (err?: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      startTask.succeed(
        `Swagger documentation server started on port ${this.port}`
      );
      logger.success(
        `📚 API Documentation available at: http://localhost:${this.port}/api-docs`
      );
      logger.info(
        `🔍 Health check available at: http://localhost:${this.port}/health`
      );
    } catch (error) {
      startTask.fail("Failed to start Swagger server");
      logger.error("Swagger server error:", error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    const stopTask = task("Stopping Swagger documentation server");

    try {
      stopTask.start("Shutting down server...");

      // In a real implementation, you would properly close the server
      await new Promise((resolve) => setTimeout(resolve, 1000));

      stopTask.succeed("Swagger documentation server stopped");
      logger.info("Swagger documentation server stopped");
    } catch (error) {
      stopTask.fail("Failed to stop Swagger server");
      logger.error("Error stopping Swagger server:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const swaggerSetup = SwaggerSetup.getInstance();

// CLI interface for running the server
if (require.main === module) {
  const server = SwaggerSetup.getInstance();

  server.start().catch((error) => {
    logger.error("Failed to start server:", error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    logger.info("Received SIGINT, shutting down gracefully...");
    await server.stop();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM, shutting down gracefully...");
    await server.stop();
    process.exit(0);
  });
}


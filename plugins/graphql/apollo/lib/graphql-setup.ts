import {
  initializeApolloClient,
  getApolloClientManager,
} from "./apollo-client";
import { initializeCache, getCacheManager } from "./graphql-cache";
import { logger } from "@KalabAmssalu/logger";
import { task } from "@KalabAmssalu/task";

export interface GraphQLSetupConfig {
  uri: string;
  token?: string;
  enableSubscriptions?: boolean;
  enablePersistence?: boolean;
  enableMetrics?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

export class GraphQLSetupManager {
  private config: GraphQLSetupConfig;
  private isInitialized = false;

  constructor(config: GraphQLSetupConfig) {
    this.config = {
      enableSubscriptions: true,
      enablePersistence: true,
      enableMetrics: true,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.warn("GraphQL setup already initialized");
      return;
    }

    const setupTask = task.create("Setting up GraphQL", {
      spinner: "dots",
      color: "blue",
    });

    try {
      setupTask.start();

      // Initialize cache first
      setupTask.update("Initializing cache...");
      const cacheManager = initializeCache({
        enablePersistence: this.config.enablePersistence,
        enableMetrics: this.config.enableMetrics,
      });

      // Restore cache from localStorage if persistence is enabled
      if (this.config.enablePersistence) {
        await cacheManager.restoreCache();
      }

      // Initialize Apollo Client
      setupTask.update("Initializing Apollo Client...");
      const apolloClientManager = await initializeApolloClient({
        uri: this.config.uri,
        token: this.config.token,
        retryAttempts: this.config.retryAttempts,
        retryDelay: this.config.retryDelay,
        enableLogging: this.config.enableMetrics,
        enableMetrics: this.config.enableMetrics,
      });

      // Set up periodic cache persistence
      if (this.config.enablePersistence) {
        setupTask.update("Setting up cache persistence...");
        this.setupCachePersistence(cacheManager);
      }

      // Set up error handling
      setupTask.update("Setting up error handling...");
      this.setupErrorHandling();

      // Set up connection monitoring
      setupTask.update("Setting up connection monitoring...");
      this.setupConnectionMonitoring(apolloClientManager);

      this.isInitialized = true;
      setupTask.succeed("GraphQL setup completed successfully");

      logger.success("GraphQL setup completed", {
        uri: this.config.uri,
        subscriptions: this.config.enableSubscriptions,
        persistence: this.config.enablePersistence,
        metrics: this.config.enableMetrics,
      });
    } catch (error) {
      setupTask.fail("GraphQL setup failed");
      logger.error("GraphQL setup failed:", error);
      throw error;
    }
  }

  private setupCachePersistence(cacheManager: any): void {
    // Persist cache every 30 seconds
    setInterval(async () => {
      try {
        await cacheManager.persistCache();
      } catch (error) {
        logger.error("Failed to persist cache:", error);
      }
    }, 30000);

    // Persist cache before page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", async () => {
        try {
          await cacheManager.persistCache();
        } catch (error) {
          logger.error("Failed to persist cache on page unload:", error);
        }
      });
    }
  }

  private setupErrorHandling(): void {
    // Global error handler for unhandled promise rejections
    if (typeof window !== "undefined") {
      window.addEventListener("unhandledrejection", (event) => {
        if (event.reason?.message?.includes("GraphQL")) {
          logger.error("Unhandled GraphQL error:", event.reason);
          event.preventDefault();
        }
      });
    }
  }

  private setupConnectionMonitoring(apolloClientManager: any): void {
    // Monitor connection health every 60 seconds
    setInterval(async () => {
      try {
        const isHealthy = await apolloClientManager.healthCheck();
        if (!isHealthy) {
          logger.warn("GraphQL connection health check failed");
        }
      } catch (error) {
        logger.error("GraphQL connection monitoring error:", error);
      }
    }, 60000);
  }

  public async validateSchema(): Promise<boolean> {
    try {
      const apolloClientManager = getApolloClientManager();
      const client = apolloClientManager.getClient();

      // Try to introspect the schema
      const result = await client.query({
        query: gql`
          query IntrospectionQuery {
            __schema {
              types {
                name
                kind
                description
              }
            }
          }
        `,
        fetchPolicy: "network-only",
      });

      if (result.data?.__schema?.types) {
        logger.success("GraphQL schema validation passed", {
          typesCount: result.data.__schema.types.length,
        });
        return true;
      }

      return false;
    } catch (error) {
      logger.error("GraphQL schema validation failed:", error);
      return false;
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      const apolloClientManager = getApolloClientManager();
      return await apolloClientManager.healthCheck();
    } catch (error) {
      logger.error("GraphQL connection test failed:", error);
      return false;
    }
  }

  public getStatus(): {
    initialized: boolean;
    config: GraphQLSetupConfig;
    cacheSize: number;
  } {
    const cacheManager = getCacheManager();
    return {
      initialized: this.isInitialized,
      config: this.config,
      cacheSize: cacheManager.getCacheSize(),
    };
  }

  public async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    const shutdownTask = task.create("Shutting down GraphQL", {
      spinner: "dots",
      color: "yellow",
    });

    try {
      shutdownTask.start();

      // Persist cache before shutdown
      const cacheManager = getCacheManager();
      await cacheManager.persistCache();

      // Clear cache
      await cacheManager.clearCache();

      this.isInitialized = false;
      shutdownTask.succeed("GraphQL shutdown completed");

      logger.info("GraphQL setup shutdown completed");
    } catch (error) {
      shutdownTask.fail("GraphQL shutdown failed");
      logger.error("GraphQL shutdown failed:", error);
      throw error;
    }
  }
}

// CLI interface
export const setupGraphQL = async (
  config: GraphQLSetupConfig
): Promise<GraphQLSetupManager> => {
  const setupManager = new GraphQLSetupManager(config);
  await setupManager.initialize();
  return setupManager;
};

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const config: GraphQLSetupConfig = {
    uri: process.env.GRAPHQL_URI || "http://localhost:4000/graphql",
    token: process.env.GRAPHQL_TOKEN,
    enableSubscriptions: process.env.GRAPHQL_SUBSCRIPTIONS !== "false",
    enablePersistence: process.env.GRAPHQL_PERSISTENCE !== "false",
    enableMetrics: process.env.GRAPHQL_METRICS !== "false",
    retryAttempts: parseInt(process.env.GRAPHQL_RETRY_ATTEMPTS || "3"),
    retryDelay: parseInt(process.env.GRAPHQL_RETRY_DELAY || "1000"),
  };

  async function runCommand() {
    try {
      const setupManager = await setupGraphQL(config);

      switch (command) {
        case "--validate":
          const isValid = await setupManager.validateSchema();
          process.exit(isValid ? 0 : 1);
          break;

        case "--test":
          const isConnected = await setupManager.testConnection();
          process.exit(isConnected ? 0 : 1);
          break;

        case "--status":
          const status = setupManager.getStatus();
          console.log(JSON.stringify(status, null, 2));
          break;

        default:
          logger.info("GraphQL setup completed successfully");
          break;
      }
    } catch (error) {
      logger.error("Command failed:", error);
      process.exit(1);
    }
  }

  runCommand();
}

// GraphQL query helper for schema introspection
const gql = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");
};

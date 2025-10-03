import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { logger } from "@KalabAmssalu/logger";
import { task } from "@KalabAmssalu/task";

export interface ApolloConfig {
  uri: string;
  token?: string;
  retryAttempts?: number;
  retryDelay?: number;
  enableLogging?: boolean;
  enableMetrics?: boolean;
}

export class ApolloClientManager {
  private client: ApolloClient<any>;
  private config: ApolloConfig;

  constructor(config: ApolloConfig) {
    this.config = {
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: true,
      enableMetrics: true,
      ...config,
    };

    this.client = this.createClient();
  }

  private createClient(): ApolloClient<any> {
    const httpLink = createHttpLink({
      uri: this.config.uri,
    });

    // Auth link
    const authLink = setContext((_, { headers }) => {
      const token = this.config.token || localStorage.getItem("auth-token");

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    // Error link
    const errorLink = onError(
      ({ graphQLErrors, networkError, operation, forward }) => {
        if (this.config.enableLogging) {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              logger.error(
                `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
              );
            });
          }

          if (networkError) {
            logger.error(`Network error: ${networkError}`);
          }
        }
      }
    );

    // Retry link
    const retryLink = new RetryLink({
      delay: {
        initial: this.config.retryDelay,
        max: Infinity,
        jitter: true,
      },
      attempts: {
        max: this.config.retryAttempts,
        retryIf: (error, _operation) => {
          // Retry on network errors but not on GraphQL errors
          return !!error && !error.result;
        },
      },
    });

    // Metrics link
    const metricsLink = new ApolloLink((operation, forward) => {
      const startTime = Date.now();

      return forward(operation).map((result) => {
        const duration = Date.now() - startTime;

        if (this.config.enableMetrics) {
          logger.info(
            `GraphQL operation ${operation.operationName} completed in ${duration}ms`
          );
        }

        return result;
      });
    });

    // Combine all links
    const link = from([errorLink, retryLink, metricsLink, authLink, httpLink]);

    return new ApolloClient({
      link,
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              // Add field policies for caching
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: {
          errorPolicy: "all",
        },
        query: {
          errorPolicy: "all",
        },
      },
    });
  }

  public getClient(): ApolloClient<any> {
    return this.client;
  }

  public async clearCache(): Promise<void> {
    await this.client.clearStore();
    logger.info("Apollo cache cleared");
  }

  public async resetStore(): Promise<void> {
    await this.client.resetStore();
    logger.info("Apollo store reset");
  }

  public setAuthToken(token: string): void {
    this.config.token = token;
    localStorage.setItem("auth-token", token);
    logger.info("Auth token updated");
  }

  public removeAuthToken(): void {
    this.config.token = undefined;
    localStorage.removeItem("auth-token");
    logger.info("Auth token removed");
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.client.query({
        query: gql`
          query HealthCheck {
            __typename
          }
        `,
        fetchPolicy: "network-only",
      });

      logger.success("GraphQL health check passed");
      return true;
    } catch (error) {
      logger.error("GraphQL health check failed:", error);
      return false;
    }
  }
}

// Global Apollo client instance
let apolloClientManager: ApolloClientManager | null = null;

export const initializeApolloClient = async (
  config: ApolloConfig
): Promise<ApolloClientManager> => {
  const setupTask = task.create("Initializing Apollo Client", {
    spinner: "dots",
    color: "blue",
  });

  try {
    setupTask.start();

    apolloClientManager = new ApolloClientManager(config);

    // Perform health check
    const isHealthy = await apolloClientManager.healthCheck();
    if (!isHealthy) {
      throw new Error("GraphQL server health check failed");
    }

    setupTask.succeed("Apollo Client initialized successfully");
    return apolloClientManager;
  } catch (error) {
    setupTask.fail("Failed to initialize Apollo Client");
    throw error;
  }
};

export const getApolloClient = (): ApolloClient<any> => {
  if (!apolloClientManager) {
    throw new Error(
      "Apollo Client not initialized. Call initializeApolloClient first."
    );
  }
  return apolloClientManager.getClient();
};

export const getApolloClientManager = (): ApolloClientManager => {
  if (!apolloClientManager) {
    throw new Error(
      "Apollo Client Manager not initialized. Call initializeApolloClient first."
    );
  }
  return apolloClientManager;
};

// GraphQL query helper
export const gql = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");
};

import { InMemoryCache, Reference } from "@apollo/client";
import { logger } from "@KalabAmssalu/logger";

export interface CacheConfig {
  enablePersistence?: boolean;
  maxSize?: number;
  ttl?: number;
  enableMetrics?: boolean;
}

export class GraphQLCacheManager {
  private cache: InMemoryCache;
  private config: CacheConfig;

  constructor(config: CacheConfig = {}) {
    this.config = {
      enablePersistence: true,
      maxSize: 1000,
      ttl: 300000, // 5 minutes
      enableMetrics: true,
      ...config,
    };

    this.cache = this.createCache();
  }

  private createCache(): InMemoryCache {
    return new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // User queries
            users: {
              keyArgs: ["filter"],
              merge(existing = [], incoming, { args }) {
                const offset = args?.offset || 0;
                if (offset === 0) {
                  return incoming;
                }
                return [...existing, ...incoming];
              },
            },
            user: {
              keyArgs: ["id"],
            },
            me: {
              merge: true,
            },

            // Product queries
            products: {
              keyArgs: ["category", "search"],
              merge(existing = [], incoming, { args }) {
                const offset = args?.offset || 0;
                if (offset === 0) {
                  return incoming;
                }
                return [...existing, ...incoming];
              },
            },
            product: {
              keyArgs: ["id"],
            },
            searchProducts: {
              keyArgs: ["query", "filters", "sort"],
            },

            // Order queries
            orders: {
              keyArgs: ["status", "userId"],
              merge(existing = [], incoming, { args }) {
                const offset = args?.offset || 0;
                if (offset === 0) {
                  return incoming;
                }
                return [...existing, ...incoming];
              },
            },
            order: {
              keyArgs: ["id"],
            },

            // Analytics queries
            salesAnalytics: {
              keyArgs: ["period", "startDate", "endDate"],
            },
            userAnalytics: {
              keyArgs: ["period"],
            },
            dashboardStats: {
              merge: true,
            },

            // Category and tag queries
            categories: {
              merge: true,
            },
            tags: {
              keyArgs: ["limit"],
            },

            // Notification queries
            notifications: {
              keyArgs: ["unreadOnly"],
              merge(existing = [], incoming, { args }) {
                const offset = args?.offset || 0;
                if (offset === 0) {
                  return incoming;
                }
                return [...existing, ...incoming];
              },
            },

            // Settings queries
            appSettings: {
              merge: true,
            },
          },
        },

        // User type policies
        User: {
          fields: {
            profile: {
              merge: true,
            },
            preferences: {
              merge: true,
            },
          },
        },

        // Product type policies
        Product: {
          fields: {
            reviews: {
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
            specifications: {
              merge: true,
            },
          },
        },

        // Order type policies
        Order: {
          fields: {
            items: {
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
            shippingAddress: {
              merge: true,
            },
          },
        },

        // Review type policies
        Review: {
          fields: {
            user: {
              merge: true,
            },
            product: {
              merge: true,
            },
          },
        },

        // Category type policies
        Category: {
          fields: {
            children: {
              merge: true,
            },
          },
        },
      },
    });
  }

  public getCache(): InMemoryCache {
    return this.cache;
  }

  public async clearCache(): Promise<void> {
    try {
      await this.cache.clear();
      logger.info("GraphQL cache cleared");
    } catch (error) {
      logger.error("Failed to clear GraphQL cache:", error);
    }
  }

  public async resetStore(): Promise<void> {
    try {
      await this.cache.reset();
      logger.info("GraphQL store reset");
    } catch (error) {
      logger.error("Failed to reset GraphQL store:", error);
    }
  }

  public evictField(fieldName: string, args?: Record<string, any>): boolean {
    try {
      const result = this.cache.evict({ fieldName, args });
      logger.info(`Evicted field: ${fieldName}`, args);
      return result;
    } catch (error) {
      logger.error(`Failed to evict field ${fieldName}:`, error);
      return false;
    }
  }

  public evictObject(id: string): boolean {
    try {
      const result = this.cache.evict({ id });
      logger.info(`Evicted object: ${id}`);
      return result;
    } catch (error) {
      logger.error(`Failed to evict object ${id}:`, error);
      return false;
    }
  }

  public modifyField(
    fieldName: string,
    modifier: (existing: any, { readField }: any) => any,
    args?: Record<string, any>
  ): boolean {
    try {
      const result = this.cache.modify({
        fields: {
          [fieldName]: modifier,
        },
        ...(args && { args }),
      });
      logger.info(`Modified field: ${fieldName}`, args);
      return result;
    } catch (error) {
      logger.error(`Failed to modify field ${fieldName}:`, error);
      return false;
    }
  }

  public readQuery<T = any>(options: any): T | null {
    try {
      return this.cache.readQuery(options);
    } catch (error) {
      logger.error("Failed to read query from cache:", error);
      return null;
    }
  }

  public writeQuery<T = any>(options: any): void {
    try {
      this.cache.writeQuery(options);
      logger.info("Query written to cache");
    } catch (error) {
      logger.error("Failed to write query to cache:", error);
    }
  }

  public readFragment<T = any>(options: any): T | null {
    try {
      return this.cache.readFragment(options);
    } catch (error) {
      logger.error("Failed to read fragment from cache:", error);
      return null;
    }
  }

  public writeFragment(options: any): void {
    try {
      this.cache.writeFragment(options);
      logger.info("Fragment written to cache");
    } catch (error) {
      logger.error("Failed to write fragment to cache:", error);
    }
  }

  public getCacheSize(): number {
    try {
      const cacheData = this.cache.extract();
      return Object.keys(cacheData).length;
    } catch (error) {
      logger.error("Failed to get cache size:", error);
      return 0;
    }
  }

  public getCacheKeys(): string[] {
    try {
      const cacheData = this.cache.extract();
      return Object.keys(cacheData);
    } catch (error) {
      logger.error("Failed to get cache keys:", error);
      return [];
    }
  }

  public async persistCache(): Promise<void> {
    if (!this.config.enablePersistence) {
      return;
    }

    try {
      const cacheData = this.cache.extract();
      localStorage.setItem("apollo-cache", JSON.stringify(cacheData));
      logger.info("Cache persisted to localStorage");
    } catch (error) {
      logger.error("Failed to persist cache:", error);
    }
  }

  public async restoreCache(): Promise<void> {
    if (!this.config.enablePersistence) {
      return;
    }

    try {
      const cacheData = localStorage.getItem("apollo-cache");
      if (cacheData) {
        this.cache.restore(JSON.parse(cacheData));
        logger.info("Cache restored from localStorage");
      }
    } catch (error) {
      logger.error("Failed to restore cache:", error);
    }
  }

  public createOptimisticResponse<T = any>(
    mutation: any,
    optimisticData: T
  ): any {
    return {
      __typename: "Mutation",
      [mutation.definitions[0].selectionSet.selections[0].name.value]:
        optimisticData,
    };
  }

  public updateCacheAfterMutation(
    mutationName: string,
    updateFn: (cache: InMemoryCache, result: any) => void
  ): (cache: InMemoryCache, result: any) => void {
    return (cache: InMemoryCache, result: any) => {
      try {
        updateFn(cache, result);
        logger.info(`Cache updated after ${mutationName} mutation`);
      } catch (error) {
        logger.error(`Failed to update cache after ${mutationName}:`, error);
      }
    };
  }
}

// Global cache manager instance
let cacheManager: GraphQLCacheManager | null = null;

export const initializeCache = (config?: CacheConfig): GraphQLCacheManager => {
  if (!cacheManager) {
    cacheManager = new GraphQLCacheManager(config);
  }
  return cacheManager;
};

export const getCacheManager = (): GraphQLCacheManager => {
  if (!cacheManager) {
    throw new Error(
      "Cache manager not initialized. Call initializeCache first."
    );
  }
  return cacheManager;
};

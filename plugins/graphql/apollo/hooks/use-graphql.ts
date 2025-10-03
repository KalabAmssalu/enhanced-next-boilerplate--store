import {
  useQuery,
  useMutation,
  useLazyQuery,
  useApolloClient,
} from "@apollo/client";
import { useCallback, useMemo } from "react";
import { logger } from "@KalabAmssalu/logger";

export interface UseGraphQLOptions {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
}

export interface UseGraphQLQueryOptions extends UseGraphQLOptions {
  skip?: boolean;
  pollInterval?: number;
  fetchPolicy?:
    | "cache-first"
    | "cache-only"
    | "network-only"
    | "no-cache"
    | "standby";
  errorPolicy?: "none" | "ignore" | "all";
  notifyOnNetworkStatusChange?: boolean;
}

export interface UseGraphQLMutationOptions extends UseGraphQLOptions {
  optimisticResponse?: any;
  update?: (cache: any, result: any) => void;
  refetchQueries?: string[];
  awaitRefetchQueries?: boolean;
}

// Generic GraphQL Query Hook
export function useGraphQLQuery<TData = any, TVariables = any>(
  query: any,
  variables?: TVariables,
  options: UseGraphQLQueryOptions = {}
) {
  const {
    enableLogging = true,
    enableMetrics = true,
    onError,
    onSuccess,
    ...apolloOptions
  } = options;

  const queryResult = useQuery<TData, TVariables>(query, {
    variables,
    ...apolloOptions,
    onCompleted: (data) => {
      if (enableLogging) {
        logger.info("GraphQL query completed", {
          queryName: query.definitions[0]?.name?.value,
          variables,
        });
      }
      onSuccess?.(data);
    },
    onError: (error) => {
      if (enableLogging) {
        logger.error("GraphQL query error", {
          queryName: query.definitions[0]?.name?.value,
          error: error.message,
          variables,
        });
      }
      onError?.(error);
    },
  });

  return {
    ...queryResult,
    // Enhanced error handling
    hasError: !!queryResult.error,
    errorMessage: queryResult.error?.message,
    // Enhanced loading state
    isLoading: queryResult.loading,
    isRefetching: queryResult.networkStatus === 4,
    // Data helpers
    data: queryResult.data,
    // Refetch with error handling
    refetch: useCallback(
      async (variables?: TVariables) => {
        try {
          const result = await queryResult.refetch(variables);
          if (enableLogging) {
            logger.info("GraphQL query refetched", {
              queryName: query.definitions[0]?.name?.value,
              variables: variables || variables,
            });
          }
          return result;
        } catch (error) {
          if (enableLogging) {
            logger.error("GraphQL query refetch error", {
              queryName: query.definitions[0]?.name?.value,
              error: error.message,
            });
          }
          throw error;
        }
      },
      [queryResult.refetch, enableLogging]
    ),
  };
}

// Generic GraphQL Mutation Hook
export function useGraphQLMutation<TData = any, TVariables = any>(
  mutation: any,
  options: UseGraphQLMutationOptions = {}
) {
  const {
    enableLogging = true,
    enableMetrics = true,
    onError,
    onSuccess,
    ...apolloOptions
  } = options;

  const [mutate, mutationResult] = useMutation<TData, TVariables>(mutation, {
    ...apolloOptions,
    onCompleted: (data) => {
      if (enableLogging) {
        logger.info("GraphQL mutation completed", {
          mutationName: mutation.definitions[0]?.name?.value,
        });
      }
      onSuccess?.(data);
    },
    onError: (error) => {
      if (enableLogging) {
        logger.error("GraphQL mutation error", {
          mutationName: mutation.definitions[0]?.name?.value,
          error: error.message,
        });
      }
      onError?.(error);
    },
  });

  const executeMutation = useCallback(
    async (variables?: TVariables) => {
      try {
        if (enableLogging) {
          logger.info("Executing GraphQL mutation", {
            mutationName: mutation.definitions[0]?.name?.value,
            variables,
          });
        }

        const result = await mutate({ variables });

        if (enableLogging) {
          logger.success("GraphQL mutation executed successfully", {
            mutationName: mutation.definitions[0]?.name?.value,
          });
        }

        return result;
      } catch (error) {
        if (enableLogging) {
          logger.error("GraphQL mutation execution failed", {
            mutationName: mutation.definitions[0]?.name?.value,
            error: error.message,
          });
        }
        throw error;
      }
    },
    [mutate, enableLogging]
  );

  return {
    ...mutationResult,
    // Enhanced error handling
    hasError: !!mutationResult.error,
    errorMessage: mutationResult.error?.message,
    // Enhanced loading state
    isLoading: mutationResult.loading,
    // Data helpers
    data: mutationResult.data,
    // Execute mutation with error handling
    execute: executeMutation,
  };
}

// Lazy Query Hook
export function useGraphQLLazyQuery<TData = any, TVariables = any>(
  query: any,
  options: UseGraphQLQueryOptions = {}
) {
  const {
    enableLogging = true,
    enableMetrics = true,
    onError,
    onSuccess,
    ...apolloOptions
  } = options;

  const [executeQuery, queryResult] = useLazyQuery<TData, TVariables>(query, {
    ...apolloOptions,
    onCompleted: (data) => {
      if (enableLogging) {
        logger.info("GraphQL lazy query completed", {
          queryName: query.definitions[0]?.name?.value,
        });
      }
      onSuccess?.(data);
    },
    onError: (error) => {
      if (enableLogging) {
        logger.error("GraphQL lazy query error", {
          queryName: query.definitions[0]?.name?.value,
          error: error.message,
        });
      }
      onError?.(error);
    },
  });

  const execute = useCallback(
    async (variables?: TVariables) => {
      try {
        if (enableLogging) {
          logger.info("Executing GraphQL lazy query", {
            queryName: query.definitions[0]?.name?.value,
            variables,
          });
        }

        const result = await executeQuery({ variables });

        if (enableLogging) {
          logger.success("GraphQL lazy query executed successfully", {
            queryName: query.definitions[0]?.name?.value,
          });
        }

        return result;
      } catch (error) {
        if (enableLogging) {
          logger.error("GraphQL lazy query execution failed", {
            queryName: query.definitions[0]?.name?.value,
            error: error.message,
          });
        }
        throw error;
      }
    },
    [executeQuery, enableLogging]
  );

  return {
    ...queryResult,
    // Enhanced error handling
    hasError: !!queryResult.error,
    errorMessage: queryResult.error?.message,
    // Enhanced loading state
    isLoading: queryResult.loading,
    // Data helpers
    data: queryResult.data,
    // Execute query with error handling
    execute,
  };
}

// Apollo Client Hook
export function useGraphQLClient() {
  const client = useApolloClient();

  const clearCache = useCallback(async () => {
    try {
      await client.clearStore();
      logger.info("Apollo cache cleared");
    } catch (error) {
      logger.error("Failed to clear Apollo cache:", error);
      throw error;
    }
  }, [client]);

  const resetStore = useCallback(async () => {
    try {
      await client.resetStore();
      logger.info("Apollo store reset");
    } catch (error) {
      logger.error("Failed to reset Apollo store:", error);
      throw error;
    }
  }, [client]);

  const readQuery = useCallback(
    <T = any>(options: any): T | null => {
      try {
        return client.readQuery(options);
      } catch (error) {
        logger.error("Failed to read query from cache:", error);
        return null;
      }
    },
    [client]
  );

  const writeQuery = useCallback(
    (options: any) => {
      try {
        client.writeQuery(options);
        logger.info("Query written to cache");
      } catch (error) {
        logger.error("Failed to write query to cache:", error);
        throw error;
      }
    },
    [client]
  );

  const readFragment = useCallback(
    <T = any>(options: any): T | null => {
      try {
        return client.readFragment(options);
      } catch (error) {
        logger.error("Failed to read fragment from cache:", error);
        return null;
      }
    },
    [client]
  );

  const writeFragment = useCallback(
    (options: any) => {
      try {
        client.writeFragment(options);
        logger.info("Fragment written to cache");
      } catch (error) {
        logger.error("Failed to write fragment to cache:", error);
        throw error;
      }
    },
    [client]
  );

  const evictField = useCallback(
    (fieldName: string, args?: Record<string, any>) => {
      try {
        const result = client.cache.evict({ fieldName, args });
        logger.info(`Evicted field: ${fieldName}`, args);
        return result;
      } catch (error) {
        logger.error(`Failed to evict field ${fieldName}:`, error);
        return false;
      }
    },
    [client]
  );

  const evictObject = useCallback(
    (id: string) => {
      try {
        const result = client.cache.evict({ id });
        logger.info(`Evicted object: ${id}`);
        return result;
      } catch (error) {
        logger.error(`Failed to evict object ${id}:`, error);
        return false;
      }
    },
    [client]
  );

  return {
    client,
    clearCache,
    resetStore,
    readQuery,
    writeQuery,
    readFragment,
    writeFragment,
    evictField,
    evictObject,
  };
}

// Custom hook for pagination
export function useGraphQLPagination<TData = any, TVariables = any>(
  query: any,
  variables: TVariables & { limit?: number; offset?: number },
  options: UseGraphQLQueryOptions = {}
) {
  const queryResult = useGraphQLQuery<TData, TVariables>(
    query,
    variables,
    options
  );

  const loadMore = useCallback(async () => {
    if (!queryResult.data) return;

    const currentData = queryResult.data as any;
    const currentItems = currentData[Object.keys(currentData)[0]] || [];
    const newOffset = currentItems.length;

    try {
      const result = await queryResult.refetch({
        ...variables,
        offset: newOffset,
      } as TVariables);

      return result;
    } catch (error) {
      logger.error("Failed to load more data:", error);
      throw error;
    }
  }, [queryResult, variables]);

  const hasMore = useMemo(() => {
    if (!queryResult.data) return false;

    const currentData = queryResult.data as any;
    const currentItems = currentData[Object.keys(currentData)[0]] || [];
    const limit = variables.limit || 10;

    return currentItems.length >= limit;
  }, [queryResult.data, variables.limit]);

  return {
    ...queryResult,
    loadMore,
    hasMore,
  };
}

// Custom hook for optimistic updates
export function useOptimisticMutation<TData = any, TVariables = any>(
  mutation: any,
  options: UseGraphQLMutationOptions = {}
) {
  const mutationResult = useGraphQLMutation<TData, TVariables>(
    mutation,
    options
  );

  const executeOptimistic = useCallback(
    async (
      variables: TVariables,
      optimisticResponse: any,
      updateCache?: (cache: any, result: any) => void
    ) => {
      try {
        const result = await mutationResult.execute({
          variables,
          optimisticResponse,
          update: updateCache,
        });

        return result;
      } catch (error) {
        logger.error("Optimistic mutation failed:", error);
        throw error;
      }
    },
    [mutationResult]
  );

  return {
    ...mutationResult,
    executeOptimistic,
  };
}



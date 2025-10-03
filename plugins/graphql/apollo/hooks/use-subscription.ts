import { useSubscription } from "@apollo/client";
import { useEffect, useCallback, useRef } from "react";
import { logger } from "@KalabAmssalu/logger";

export interface UseGraphQLSubscriptionOptions {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  onError?: (error: any) => void;
  onData?: (data: any) => void;
  onComplete?: () => void;
  shouldResubscribe?: boolean;
  skip?: boolean;
}

// Generic GraphQL Subscription Hook
export function useGraphQLSubscription<TData = any, TVariables = any>(
  subscription: any,
  variables?: TVariables,
  options: UseGraphQLSubscriptionOptions = {}
) {
  const {
    enableLogging = true,
    enableMetrics = true,
    onError,
    onData,
    onComplete,
    shouldResubscribe = true,
    skip = false,
    ...apolloOptions
  } = options;

  const subscriptionResult = useSubscription<TData, TVariables>(subscription, {
    variables,
    skip,
    shouldResubscribe,
    ...apolloOptions,
    onSubscriptionData: ({ subscriptionData }) => {
      if (enableLogging) {
        logger.info("GraphQL subscription data received", {
          subscriptionName: subscription.definitions[0]?.name?.value,
          variables,
        });
      }
      onData?.(subscriptionData.data);
    },
    onSubscriptionComplete: () => {
      if (enableLogging) {
        logger.info("GraphQL subscription completed", {
          subscriptionName: subscription.definitions[0]?.name?.value,
        });
      }
      onComplete?.();
    },
    onSubscriptionError: (error) => {
      if (enableLogging) {
        logger.error("GraphQL subscription error", {
          subscriptionName: subscription.definitions[0]?.name?.value,
          error: error.message,
          variables,
        });
      }
      onError?.(error);
    },
  });

  return {
    ...subscriptionResult,
    // Enhanced error handling
    hasError: !!subscriptionResult.error,
    errorMessage: subscriptionResult.error?.message,
    // Enhanced loading state
    isLoading: subscriptionResult.loading,
    // Data helpers
    data: subscriptionResult.data,
  };
}

// Real-time User Status Hook
export function useUserOnlineStatus(userIds: string[]) {
  const { data, error, loading } = useGraphQLSubscription(
    gql`
      subscription UserOnlineStatus($userIds: [ID!]) {
        userOnlineStatus(userIds: $userIds) {
          userId
          isOnline
          lastSeen
        }
      }
    `,
    { userIds },
    {
      enableLogging: true,
      onData: (data) => {
        logger.info("User online status updated", data);
      },
    }
  );

  return {
    onlineStatus: data?.userOnlineStatus || [],
    error,
    loading,
  };
}

// Real-time Order Status Hook
export function useOrderStatusSubscription(orderId?: string) {
  const { data, error, loading } = useGraphQLSubscription(
    gql`
      subscription OrderStatusChanged($orderId: ID) {
        orderStatusChanged(orderId: $orderId) {
          id
          orderNumber
          status
          updatedAt
          trackingNumber
        }
      }
    `,
    { orderId },
    {
      enableLogging: true,
      onData: (data) => {
        logger.info("Order status updated", data);
      },
    }
  );

  return {
    orderStatus: data?.orderStatusChanged,
    error,
    loading,
  };
}

// Real-time Notifications Hook
export function useNotificationSubscription(userId?: string) {
  const { data, error, loading } = useGraphQLSubscription(
    gql`
      subscription NotificationReceived($userId: ID) {
        notificationReceived(userId: $userId) {
          id
          title
          message
          type
          read
          actionUrl
          createdAt
        }
      }
    `,
    { userId },
    {
      enableLogging: true,
      onData: (data) => {
        logger.info("New notification received", data);
      },
    }
  );

  return {
    notification: data?.notificationReceived,
    error,
    loading,
  };
}

// Real-time Product Updates Hook
export function useProductUpdatesSubscription(productId?: string) {
  const { data, error, loading } = useGraphQLSubscription(
    gql`
      subscription ProductStockUpdated($productId: ID) {
        productStockUpdated(productId: $productId) {
          id
          name
          inStock
          updatedAt
        }
      }
    `,
    { productId },
    {
      enableLogging: true,
      onData: (data) => {
        logger.info("Product stock updated", data);
      },
    }
  );

  return {
    productUpdate: data?.productStockUpdated,
    error,
    loading,
  };
}

// Real-time Chat Messages Hook
export function useChatMessagesSubscription(chatId: string) {
  const { data, error, loading } = useGraphQLSubscription(
    gql`
      subscription MessageReceived($chatId: ID) {
        messageReceived(chatId: $chatId) {
          id
          content
          sender {
            id
            name
            avatar
          }
          chatId
          timestamp
          type
        }
      }
    `,
    { chatId },
    {
      enableLogging: true,
      onData: (data) => {
        logger.info("New message received", data);
      },
    }
  );

  return {
    message: data?.messageReceived,
    error,
    loading,
  };
}

// Real-time System Status Hook
export function useSystemStatusSubscription() {
  const { data, error, loading } = useGraphQLSubscription(
    gql`
      subscription SystemStatusUpdated {
        systemStatusUpdated {
          status
          message
          timestamp
          services {
            name
            status
            responseTime
            lastCheck
          }
        }
      }
    `,
    {},
    {
      enableLogging: true,
      onData: (data) => {
        logger.info("System status updated", data);
      },
    }
  );

  return {
    systemStatus: data?.systemStatusUpdated,
    error,
    loading,
  };
}

// Real-time Analytics Hook
export function useAnalyticsSubscription(period: string) {
  const { data, error, loading } = useGraphQLSubscription(
    gql`
      subscription SalesMetricsUpdated($period: AnalyticsPeriod!) {
        salesMetricsUpdated(period: $period) {
          period
          totalSales
          totalOrders
          averageOrderValue
          topProducts {
            product {
              id
              name
            }
            quantity
            revenue
          }
          updatedAt
        }
      }
    `,
    { period },
    {
      enableLogging: true,
      onData: (data) => {
        logger.info("Sales metrics updated", data);
      },
    }
  );

  return {
    analytics: data?.salesMetricsUpdated,
    error,
    loading,
  };
}

// Real-time Inventory Alerts Hook
export function useInventoryAlertsSubscription() {
  const { data, error, loading } = useGraphQLSubscription(
    gql`
      subscription InventoryLowStock {
        inventoryLowStock {
          product {
            id
            name
            sku
          }
          currentStock
          minimumStock
          alertLevel
          timestamp
        }
      }
    `,
    {},
    {
      enableLogging: true,
      onData: (data) => {
        logger.warn("Low stock alert received", data);
      },
    }
  );

  return {
    alert: data?.inventoryLowStock,
    error,
    loading,
  };
}

// Real-time Security Alerts Hook
export function useSecurityAlertsSubscription() {
  const { data, error, loading } = useGraphQLSubscription(
    gql`
      subscription SecurityAlert {
        securityAlert {
          id
          type
          severity
          message
          source
          timestamp
          resolved
        }
      }
    `,
    {},
    {
      enableLogging: true,
      onData: (data) => {
        logger.error("Security alert received", data);
      },
    }
  );

  return {
    alert: data?.securityAlert,
    error,
    loading,
  };
}

// Custom hook for managing multiple subscriptions
export function useMultipleSubscriptions(
  subscriptions: Array<{
    subscription: any;
    variables?: any;
    options?: UseGraphQLSubscriptionOptions;
  }>
) {
  const results = subscriptions.map(({ subscription, variables, options }) =>
    useGraphQLSubscription(subscription, variables, options)
  );

  const hasAnyError = results.some((result) => result.hasError);
  const isAnyLoading = results.some((result) => result.isLoading);
  const allData = results.map((result) => result.data);

  return {
    results,
    hasAnyError,
    isAnyLoading,
    allData,
  };
}

// Custom hook for subscription with automatic reconnection
export function useReconnectingSubscription<TData = any, TVariables = any>(
  subscription: any,
  variables?: TVariables,
  options: UseGraphQLSubscriptionOptions & {
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
  } = {}
) {
  const {
    reconnectInterval = 5000,
    maxReconnectAttempts = 10,
    ...subscriptionOptions
  } = options;

  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const subscriptionResult = useGraphQLSubscription<TData, TVariables>(
    subscription,
    variables,
    {
      ...subscriptionOptions,
      onError: (error) => {
        subscriptionOptions.onError?.(error);

        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          logger.warn(
            `Subscription error, attempting reconnect ${reconnectAttempts.current}/${maxReconnectAttempts}`
          );

          reconnectTimeout.current = setTimeout(() => {
            // The subscription will automatically reconnect
          }, reconnectInterval);
        } else {
          logger.error("Max reconnection attempts reached");
        }
      },
      onData: (data) => {
        // Reset reconnect attempts on successful data
        reconnectAttempts.current = 0;
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
        subscriptionOptions.onData?.(data);
      },
    }
  );

  useEffect(() => {
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  return {
    ...subscriptionResult,
    reconnectAttempts: reconnectAttempts.current,
    isReconnecting: reconnectAttempts.current > 0,
  };
}

// GraphQL query helper
const gql = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");
};



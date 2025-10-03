import { gql } from "./apollo-client";

// Real-time User Subscriptions
export const USER_UPDATED = gql`
  subscription UserUpdated($userId: ID) {
    userUpdated(userId: $userId) {
      id
      email
      name
      role
      updatedAt
      profile {
        avatar
        bio
        location
      }
    }
  }
`;

export const USER_ONLINE_STATUS = gql`
  subscription UserOnlineStatus($userIds: [ID!]) {
    userOnlineStatus(userIds: $userIds) {
      userId
      isOnline
      lastSeen
    }
  }
`;

// Real-time Order Subscriptions
export const ORDER_STATUS_CHANGED = gql`
  subscription OrderStatusChanged($orderId: ID) {
    orderStatusChanged(orderId: $orderId) {
      id
      orderNumber
      status
      updatedAt
      trackingNumber
    }
  }
`;

export const NEW_ORDER_CREATED = gql`
  subscription NewOrderCreated {
    newOrderCreated {
      id
      orderNumber
      status
      total
      customer {
        id
        name
        email
      }
      createdAt
    }
  }
`;

// Real-time Product Subscriptions
export const PRODUCT_STOCK_UPDATED = gql`
  subscription ProductStockUpdated($productId: ID) {
    productStockUpdated(productId: $productId) {
      id
      name
      inStock
      updatedAt
    }
  }
`;

export const PRODUCT_PRICE_CHANGED = gql`
  subscription ProductPriceChanged($productId: ID) {
    productPriceChanged(productId: $productId) {
      id
      name
      price
      previousPrice
      updatedAt
    }
  }
`;

// Real-time Review Subscriptions
export const NEW_REVIEW_ADDED = gql`
  subscription NewReviewAdded($productId: ID) {
    newReviewAdded(productId: $productId) {
      id
      rating
      comment
      product {
        id
        name
      }
      user {
        id
        name
        avatar
      }
      createdAt
    }
  }
`;

export const REVIEW_UPDATED = gql`
  subscription ReviewUpdated($reviewId: ID) {
    reviewUpdated(reviewId: $reviewId) {
      id
      rating
      comment
      updatedAt
    }
  }
`;

// Real-time Notification Subscriptions
export const NOTIFICATION_RECEIVED = gql`
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
`;

export const NOTIFICATION_UPDATED = gql`
  subscription NotificationUpdated($notificationId: ID) {
    notificationUpdated(notificationId: $notificationId) {
      id
      read
      updatedAt
    }
  }
`;

// Real-time Analytics Subscriptions
export const SALES_METRICS_UPDATED = gql`
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
`;

export const USER_ACTIVITY_UPDATED = gql`
  subscription UserActivityUpdated {
    userActivityUpdated {
      userId
      activity
      timestamp
      metadata
    }
  }
`;

// Real-time Chat/Messaging Subscriptions
export const MESSAGE_RECEIVED = gql`
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
`;

export const CHAT_TYPING = gql`
  subscription ChatTyping($chatId: ID) {
    chatTyping(chatId: $chatId) {
      userId
      userName
      isTyping
      timestamp
    }
  }
`;

// Real-time System Status Subscriptions
export const SYSTEM_STATUS_UPDATED = gql`
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
`;

export const SERVER_HEALTH_UPDATED = gql`
  subscription ServerHealthUpdated {
    serverHealthUpdated {
      status
      uptime
      memoryUsage
      cpuUsage
      activeConnections
      timestamp
    }
  }
`;

// Real-time Inventory Subscriptions
export const INVENTORY_LOW_STOCK = gql`
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
`;

export const INVENTORY_UPDATED = gql`
  subscription InventoryUpdated($productId: ID) {
    inventoryUpdated(productId: $productId) {
      product {
        id
        name
        sku
      }
      quantity
      operation
      reason
      timestamp
    }
  }
`;

// Real-time Payment Subscriptions
export const PAYMENT_STATUS_UPDATED = gql`
  subscription PaymentStatusUpdated($orderId: ID) {
    paymentStatusUpdated(orderId: $orderId) {
      orderId
      paymentId
      status
      amount
      currency
      method
      timestamp
    }
  }
`;

export const PAYMENT_FAILED = gql`
  subscription PaymentFailed($orderId: ID) {
    paymentFailed(orderId: $orderId) {
      orderId
      paymentId
      error
      retryCount
      timestamp
    }
  }
`;

// Real-time Shipping Subscriptions
export const SHIPPING_STATUS_UPDATED = gql`
  subscription ShippingStatusUpdated($orderId: ID) {
    shippingStatusUpdated(orderId: $orderId) {
      orderId
      trackingNumber
      status
      location
      estimatedDelivery
      timestamp
    }
  }
`;

export const DELIVERY_CONFIRMED = gql`
  subscription DeliveryConfirmed($orderId: ID) {
    deliveryConfirmed(orderId: $orderId) {
      orderId
      deliveredAt
      recipient
      signature
      timestamp
    }
  }
`;

// Real-time Admin Dashboard Subscriptions
export const ADMIN_DASHBOARD_UPDATED = gql`
  subscription AdminDashboardUpdated {
    adminDashboardUpdated {
      totalUsers
      totalOrders
      totalRevenue
      newUsers
      pendingOrders
      lowStockProducts
      timestamp
    }
  }
`;

export const SECURITY_ALERT = gql`
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
`;

import { gql } from "../lib/apollo-client";

// User Fragments
export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
    name
    role
    isActive
    createdAt
    updatedAt
  }
`;

export const USER_WITH_PROFILE_FRAGMENT = gql`
  fragment UserWithProfileFragment on User {
    ...UserFragment
    profile {
      avatar
      bio
      location
      socialLinks {
        platform
        url
      }
    }
    preferences {
      theme
      language
      notifications
    }
  }
  ${USER_FRAGMENT}
`;

export const USER_BASIC_FRAGMENT = gql`
  fragment UserBasicFragment on User {
    id
    name
    email
    profile {
      avatar
    }
  }
`;

// Product Fragments
export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    name
    description
    price
    category
    images
    inStock
    rating
    createdAt
    updatedAt
  }
`;

export const PRODUCT_WITH_REVIEWS_FRAGMENT = gql`
  fragment ProductWithReviewsFragment on Product {
    ...ProductFragment
    reviews {
      id
      rating
      comment
      user {
        ...UserBasicFragment
      }
      createdAt
    }
    specifications {
      key
      value
    }
  }
  ${PRODUCT_FRAGMENT}
  ${USER_BASIC_FRAGMENT}
`;

export const PRODUCT_BASIC_FRAGMENT = gql`
  fragment ProductBasicFragment on Product {
    id
    name
    price
    images
    inStock
    rating
  }
`;

// Order Fragments
export const ORDER_FRAGMENT = gql`
  fragment OrderFragment on Order {
    id
    orderNumber
    status
    total
    paymentMethod
    trackingNumber
    createdAt
    updatedAt
  }
`;

export const ORDER_WITH_ITEMS_FRAGMENT = gql`
  fragment OrderWithItemsFragment on Order {
    ...OrderFragment
    items {
      id
      product {
        ...ProductBasicFragment
      }
      quantity
      price
    }
    shippingAddress {
      street
      city
      state
      zipCode
      country
    }
  }
  ${ORDER_FRAGMENT}
  ${PRODUCT_BASIC_FRAGMENT}
`;

export const ORDER_BASIC_FRAGMENT = gql`
  fragment OrderBasicFragment on Order {
    id
    orderNumber
    status
    total
    createdAt
  }
`;

// Review Fragments
export const REVIEW_FRAGMENT = gql`
  fragment ReviewFragment on Review {
    id
    rating
    comment
    createdAt
    updatedAt
  }
`;

export const REVIEW_WITH_USER_FRAGMENT = gql`
  fragment ReviewWithUserFragment on Review {
    ...ReviewFragment
    user {
      ...UserBasicFragment
    }
    product {
      id
      name
    }
  }
  ${REVIEW_FRAGMENT}
  ${USER_BASIC_FRAGMENT}
`;

// Category Fragments
export const CATEGORY_FRAGMENT = gql`
  fragment CategoryFragment on Category {
    id
    name
    description
    slug
    parentId
    productCount
  }
`;

export const CATEGORY_WITH_CHILDREN_FRAGMENT = gql`
  fragment CategoryWithChildrenFragment on Category {
    ...CategoryFragment
    children {
      id
      name
      slug
    }
  }
  ${CATEGORY_FRAGMENT}
`;

// Notification Fragments
export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFragment on Notification {
    id
    title
    message
    type
    read
    actionUrl
    createdAt
  }
`;

// Analytics Fragments
export const SALES_ANALYTICS_FRAGMENT = gql`
  fragment SalesAnalyticsFragment on SalesAnalytics {
    totalSales
    totalOrders
    averageOrderValue
    topProducts {
      product {
        ...ProductBasicFragment
      }
      quantity
      revenue
    }
    salesByPeriod {
      period
      sales
      orders
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
`;

export const USER_ANALYTICS_FRAGMENT = gql`
  fragment UserAnalyticsFragment on UserAnalytics {
    totalUsers
    newUsers
    activeUsers
    userGrowth {
      period
      count
    }
    userSegments {
      segment
      count
      percentage
    }
  }
`;

export const DASHBOARD_STATS_FRAGMENT = gql`
  fragment DashboardStatsFragment on DashboardStats {
    totalUsers
    totalProducts
    totalOrders
    totalRevenue
    recentOrders {
      ...OrderBasicFragment
    }
    topProducts {
      product {
        ...ProductBasicFragment
      }
      quantity
      revenue
    }
    salesChart {
      period
      sales
      orders
    }
  }
  ${ORDER_BASIC_FRAGMENT}
  ${PRODUCT_BASIC_FRAGMENT}
`;

// Search Result Fragments
export const SEARCH_RESULT_FRAGMENT = gql`
  fragment SearchResultFragment on SearchResult {
    id
    name
    description
    price
    category
    images
    inStock
    rating
    highlights {
      field
      value
    }
  }
`;

// File Upload Fragments
export const FILE_UPLOAD_FRAGMENT = gql`
  fragment FileUploadFragment on FileUpload {
    id
    filename
    url
    size
    mimeType
    uploadedAt
  }
`;

// Auth Payload Fragments
export const AUTH_PAYLOAD_FRAGMENT = gql`
  fragment AuthPayloadFragment on AuthPayload {
    token
    refreshToken
    user {
      ...UserWithProfileFragment
    }
  }
  ${USER_WITH_PROFILE_FRAGMENT}
`;

// Mutation Result Fragments
export const MUTATION_RESULT_FRAGMENT = gql`
  fragment MutationResultFragment on MutationResult {
    success
    message
  }
`;

// Bulk Operation Result Fragments
export const BULK_OPERATION_RESULT_FRAGMENT = gql`
  fragment BulkOperationResultFragment on BulkOperationResult {
    success
    updatedCount
    deletedCount
    errors {
      id
      message
    }
  }
`;

// App Settings Fragments
export const APP_SETTINGS_FRAGMENT = gql`
  fragment AppSettingsFragment on AppSettings {
    theme
    language
    currency
    timezone
    features {
      name
      enabled
    }
    integrations {
      name
      enabled
      config
    }
  }
`;

// Subscription Fragments
export const USER_ONLINE_STATUS_FRAGMENT = gql`
  fragment UserOnlineStatusFragment on UserOnlineStatus {
    userId
    isOnline
    lastSeen
  }
`;

export const PRODUCT_PRICE_CHANGE_FRAGMENT = gql`
  fragment ProductPriceChangeFragment on ProductPriceChange {
    id
    name
    price
    previousPrice
    updatedAt
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    content
    sender {
      ...UserBasicFragment
    }
    chatId
    timestamp
    type
  }
  ${USER_BASIC_FRAGMENT}
`;

export const TYPING_STATUS_FRAGMENT = gql`
  fragment TypingStatusFragment on TypingStatus {
    userId
    userName
    isTyping
    timestamp
  }
`;

export const SYSTEM_STATUS_FRAGMENT = gql`
  fragment SystemStatusFragment on SystemStatus {
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
`;

export const SERVER_HEALTH_FRAGMENT = gql`
  fragment ServerHealthFragment on ServerHealth {
    status
    uptime
    memoryUsage
    cpuUsage
    activeConnections
    timestamp
  }
`;

export const INVENTORY_ALERT_FRAGMENT = gql`
  fragment InventoryAlertFragment on InventoryAlert {
    product {
      ...ProductBasicFragment
    }
    currentStock
    minimumStock
    alertLevel
    timestamp
  }
  ${PRODUCT_BASIC_FRAGMENT}
`;

export const PAYMENT_UPDATE_FRAGMENT = gql`
  fragment PaymentUpdateFragment on PaymentUpdate {
    orderId
    paymentId
    status
    amount
    currency
    method
    timestamp
  }
`;

export const SHIPPING_UPDATE_FRAGMENT = gql`
  fragment ShippingUpdateFragment on ShippingUpdate {
    orderId
    trackingNumber
    status
    location
    estimatedDelivery
    timestamp
  }
`;

export const SECURITY_ALERT_FRAGMENT = gql`
  fragment SecurityAlertFragment on SecurityAlert {
    id
    type
    severity
    message
    source
    timestamp
    resolved
  }
`;

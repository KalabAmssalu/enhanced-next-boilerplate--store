import { gql } from "./apollo-client";

// User Management Queries
export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int, $filter: UserFilter) {
    users(limit: $limit, offset: $offset, filter: $filter) {
      id
      email
      name
      role
      createdAt
      updatedAt
      profile {
        avatar
        bio
        location
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      email
      name
      role
      createdAt
      updatedAt
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
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      name
      role
      createdAt
      updatedAt
      profile {
        avatar
        bio
        location
      }
      preferences {
        theme
        language
        notifications
      }
    }
  }
`;

// Product Management Queries
export const GET_PRODUCTS = gql`
  query GetProducts(
    $limit: Int
    $offset: Int
    $category: String
    $search: String
  ) {
    products(
      limit: $limit
      offset: $offset
      category: $category
      search: $search
    ) {
      id
      name
      description
      price
      category
      images
      inStock
      rating
      reviews {
        id
        rating
        comment
        user {
          name
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      category
      images
      inStock
      rating
      reviews {
        id
        rating
        comment
        user {
          name
          avatar
        }
        createdAt
      }
      specifications {
        key
        value
      }
      createdAt
      updatedAt
    }
  }
`;

// Order Management Queries
export const GET_ORDERS = gql`
  query GetOrders(
    $limit: Int
    $offset: Int
    $status: OrderStatus
    $userId: ID
  ) {
    orders(limit: $limit, offset: $offset, status: $status, userId: $userId) {
      id
      orderNumber
      status
      total
      items {
        id
        product {
          id
          name
          price
          images
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
      createdAt
      updatedAt
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      status
      total
      items {
        id
        product {
          id
          name
          price
          images
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
      paymentMethod
      trackingNumber
      createdAt
      updatedAt
    }
  }
`;

// Analytics Queries
export const GET_SALES_ANALYTICS = gql`
  query GetSalesAnalytics(
    $period: AnalyticsPeriod!
    $startDate: String
    $endDate: String
  ) {
    salesAnalytics(period: $period, startDate: $startDate, endDate: $endDate) {
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
      salesByPeriod {
        period
        sales
        orders
      }
    }
  }
`;

export const GET_USER_ANALYTICS = gql`
  query GetUserAnalytics($period: AnalyticsPeriod!) {
    userAnalytics(period: $period) {
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
  }
`;

// Dashboard Queries
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      totalProducts
      totalOrders
      totalRevenue
      recentOrders {
        id
        orderNumber
        customer {
          name
          email
        }
        total
        status
        createdAt
      }
      topProducts {
        id
        name
        sales
        revenue
      }
      salesChart {
        period
        sales
        orders
      }
    }
  }
`;

// Search Queries
export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $query: String!
    $filters: ProductFilters
    $sort: ProductSort
  ) {
    searchProducts(query: $query, filters: $filters, sort: $sort) {
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
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!, $role: UserRole) {
    searchUsers(query: $query, role: $role) {
      id
      name
      email
      role
      profile {
        avatar
        bio
      }
    }
  }
`;

// Category and Tag Queries
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      slug
      parentId
      children {
        id
        name
        slug
      }
      productCount
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags($limit: Int) {
    tags(limit: $limit) {
      id
      name
      slug
      usageCount
    }
  }
`;

// Notification Queries
export const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int, $unreadOnly: Boolean) {
    notifications(limit: $limit, unreadOnly: $unreadOnly) {
      id
      title
      message
      type
      read
      createdAt
      actionUrl
    }
  }
`;

// Settings Queries
export const GET_APP_SETTINGS = gql`
  query GetAppSettings {
    appSettings {
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
  }
`;

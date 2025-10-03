import { gql } from "./apollo-client";

// User Management Mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      name
      role
      createdAt
      profile {
        avatar
        bio
        location
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      name
      role
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

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      profile {
        avatar
        bio
        location
        socialLinks {
          platform
          url
        }
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      success
      message
    }
  }
`;

// Authentication Mutations
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
      user {
        id
        email
        name
        role
        profile {
          avatar
        }
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      refreshToken
      user {
        id
        email
        name
        role
        profile {
          avatar
        }
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      success
      message
    }
  }
`;

// Product Management Mutations
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      category
      images
      inStock
      createdAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      category
      images
      inStock
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`;

export const UPLOAD_PRODUCT_IMAGE = gql`
  mutation UploadProductImage($productId: ID!, $file: Upload!) {
    uploadProductImage(productId: $productId, file: $file) {
      id
      images
    }
  }
`;

// Order Management Mutations
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
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
        }
        quantity
        price
      }
      createdAt
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!, $reason: String) {
    cancelOrder(id: $id, reason: $reason) {
      success
      message
    }
  }
`;

export const ADD_ORDER_ITEM = gql`
  mutation AddOrderItem($orderId: ID!, $input: AddOrderItemInput!) {
    addOrderItem(orderId: $orderId, input: $input) {
      id
      items {
        id
        product {
          id
          name
          price
        }
        quantity
        price
      }
      total
    }
  }
`;

export const REMOVE_ORDER_ITEM = gql`
  mutation RemoveOrderItem($orderId: ID!, $itemId: ID!) {
    removeOrderItem(orderId: $orderId, itemId: $itemId) {
      id
      items {
        id
        product {
          id
          name
          price
        }
        quantity
        price
      }
      total
    }
  }
`;

// Review and Rating Mutations
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
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
      }
      createdAt
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: ID!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
      id
      rating
      comment
      updatedAt
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      success
      message
    }
  }
`;

// Category Management Mutations
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
      slug
      parentId
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      description
      slug
      updatedAt
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      success
      message
    }
  }
`;

// Notification Mutations
export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      read
      updatedAt
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      success
      message
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id) {
      success
      message
    }
  }
`;

// Settings Mutations
export const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences($input: UpdatePreferencesInput!) {
    updatePreferences(input: $input) {
      id
      preferences {
        theme
        language
        notifications
      }
    }
  }
`;

export const UPDATE_APP_SETTINGS = gql`
  mutation UpdateAppSettings($input: UpdateAppSettingsInput!) {
    updateAppSettings(input: $input) {
      theme
      language
      currency
      timezone
      features {
        name
        enabled
      }
    }
  }
`;

// File Upload Mutations
export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!, $folder: String) {
    uploadFile(file: $file, folder: $folder) {
      id
      filename
      url
      size
      mimeType
      uploadedAt
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($id: ID!) {
    deleteFile(id: $id) {
      success
      message
    }
  }
`;

// Bulk Operations
export const BULK_UPDATE_PRODUCTS = gql`
  mutation BulkUpdateProducts($ids: [ID!]!, $input: UpdateProductInput!) {
    bulkUpdateProducts(ids: $ids, input: $input) {
      success
      updatedCount
      errors {
        id
        message
      }
    }
  }
`;

export const BULK_DELETE_PRODUCTS = gql`
  mutation BulkDeleteProducts($ids: [ID!]!) {
    bulkDeleteProducts(ids: $ids) {
      success
      deletedCount
      errors {
        id
        message
      }
    }
  }
`;

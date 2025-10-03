// Common constants
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
} as const;

export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
  TEXT: "text/plain",
  HTML: "text/html",
  CSS: "text/css",
  JAVASCRIPT: "application/javascript",
  XML: "application/xml",
  PDF: "application/pdf",
  IMAGE_JPEG: "image/jpeg",
  IMAGE_PNG: "image/png",
  IMAGE_GIF: "image/gif",
  IMAGE_SVG: "image/svg+xml",
} as const;

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  IPV6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
} as const;

export const DATE_FORMATS = {
  ISO: "yyyy-MM-dd",
  US: "MM/dd/yyyy",
  EU: "dd/MM/yyyy",
  DATETIME: "yyyy-MM-dd HH:mm:ss",
  TIME: "HH:mm:ss",
  TIMESTAMP: "yyyy-MM-dd HH:mm:ss.SSS",
} as const;

export const STORAGE_KEYS = {
  THEME: "theme",
  LANGUAGE: "language",
  USER_PREFERENCES: "user-preferences",
  AUTH_TOKEN: "auth-token",
  REFRESH_TOKEN: "refresh-token",
  CART: "cart",
  RECENT_SEARCHES: "recent-searches",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET: "/users/:id",
    UPDATE: "/users/:id",
    DELETE: "/users/:id",
  },
  UPLOAD: {
    IMAGE: "/upload/image",
    DOCUMENT: "/upload/document",
    AVATAR: "/upload/avatar",
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "An internal server error occurred.",
  TIMEOUT: "Request timed out. Please try again.",
  UNKNOWN_ERROR: "An unknown error occurred.",
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: "Successfully created.",
  UPDATED: "Successfully updated.",
  DELETED: "Successfully deleted.",
  SAVED: "Successfully saved.",
  SENT: "Successfully sent.",
  UPLOADED: "Successfully uploaded.",
} as const;

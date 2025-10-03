// Auto-generated API types from OpenAPI specification
// Run 'npm run api:generate-types' to regenerate

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "moderator";
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  users: User[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AnalyticsResponse {
  period: string;
  metrics: {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
    conversionRate: number;
  };
  charts: ChartData[];
}

export interface ChartData {
  name: string;
  type: "line" | "bar" | "pie" | "area";
  data: Array<{
    label: string;
    value: number;
  }>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}

// API Response wrapper types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  errors?: string[];
}

// Request parameter types
export interface GetUsersParams {
  page?: number;
  limit?: number;
}

export interface GetAnalyticsParams {
  period?: "day" | "week" | "month" | "quarter" | "year";
}

// Utility types for API operations
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiEndpoint {
  method: ApiMethod;
  path: string;
  description?: string;
  tags?: string[];
}

// Common API error types
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(400, message, details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = "Authentication required") {
    super(401, message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = "Insufficient permissions") {
    super(403, message);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ServerError extends ApiError {
  constructor(message: string = "Internal server error") {
    super(500, message);
    this.name = "ServerError";
  }
}


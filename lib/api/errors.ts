// API Error Handling
// Consistent error format across all API routes

import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Format error response consistently
 */
export function errorResponse(
  error: unknown,
  statusCode: number = 500
): NextResponse<ApiError> {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: error.errors,
        },
      },
      { status: 400 }
    );
  }

  // Handle custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : "An error occurred";

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    },
    { status: statusCode }
  );
}

/**
 * Common error factories
 */
export const errors = {
  unauthorized: (message = "Unauthorized") =>
    new AppError(401, "UNAUTHORIZED", message),

  forbidden: (message = "Forbidden") =>
    new AppError(403, "FORBIDDEN", message),

  notFound: (resource = "Resource") =>
    new AppError(404, "NOT_FOUND", `${resource} not found`),

  badRequest: (message: string, details?: any) =>
    new AppError(400, "BAD_REQUEST", message, details),

  ageVerificationRequired: () =>
    new AppError(
      403,
      "AGE_VERIFICATION_REQUIRED",
      "Age verification required to access this feature"
    ),

  cooldownActive: (until: Date) =>
    new AppError(403, "COOLDOWN_ACTIVE", "Account is in cooldown period", {
      cooldownUntil: until.toISOString(),
    }),

  rateLimit: (retryAfter: number) =>
    new AppError(429, "RATE_LIMIT_EXCEEDED", "Too many requests", {
      retryAfter,
    }),
};


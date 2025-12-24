// POST /api/responsible/verify-age
// Verify user's age for responsible gaming

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, errors } from "@/lib/api/errors";
import { requireAuth } from "@/lib/api/auth";
import { checkRateLimit, rateLimits } from "@/lib/api/rateLimit";
import { VerifyAgeSchema } from "@/lib/api/validation";

/**
 * Example Response:
 * {
 *   "verified": true,
 *   "verifiedAt": "2024-12-24T02:00:00.000Z",
 *   "message": "Age verification successful"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Check rate limit (5 attempts per minute)
    const rateLimit = checkRateLimit(
      `verify-age:${user.id}`,
      rateLimits.strict
    );
    if (!rateLimit.allowed) {
      throw errors.rateLimit(rateLimit.retryAfter!);
    }

    // Parse and validate request body
    const body = await request.json();
    const data = VerifyAgeSchema.parse(body);

    // Calculate age
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Verify age requirement (21+ for US)
    if (age < 21) {
      throw errors.forbidden("Must be 21 or older to use this platform");
    }

    // Get or create responsible settings
    const settings = await prisma.responsibleSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ageVerified: true,
        ageVerifiedAt: new Date(),
      },
      update: {
        ageVerified: true,
        ageVerifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      verified: true,
      verifiedAt: settings.ageVerifiedAt,
      message: "Age verification successful",
    });
  } catch (error) {
    return errorResponse(error);
  }
}


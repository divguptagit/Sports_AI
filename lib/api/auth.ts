// API Authentication Helpers

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errors } from "./errors";

/**
 * Get current user session or throw
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw errors.unauthorized("Authentication required");
  }

  return session.user as any;
}

/**
 * Get user with responsible settings
 */
export async function getUserWithSettings(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { responsibleSettings: true },
  });

  if (!user) {
    throw errors.notFound("User");
  }

  return user;
}

/**
 * Enforce age verification before accessing sensitive features
 */
export async function requireAgeVerification(userId: string) {
  const user = await getUserWithSettings(userId);

  if (!user.responsibleSettings?.ageVerified) {
    throw errors.ageVerificationRequired();
  }

  return user;
}

/**
 * Check if user is in cooldown period
 */
export async function checkCooldown(userId: string) {
  const user = await getUserWithSettings(userId);

  if (
    user.responsibleSettings?.cooldownUntil &&
    user.responsibleSettings.cooldownUntil > new Date()
  ) {
    throw errors.cooldownActive(user.responsibleSettings.cooldownUntil);
  }

  return user;
}

/**
 * Enforce both age verification and cooldown check
 */
export async function requirePickAccess(userId: string) {
  await requireAgeVerification(userId);
  await checkCooldown(userId);
}

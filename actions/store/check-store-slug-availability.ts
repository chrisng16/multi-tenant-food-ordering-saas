"use server";

import { db } from "@/db";
import { stores } from "@/db/schema";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { storeSchema } from "@/schemas/store";
import { eq } from "drizzle-orm";

type CheckSlugResult = {
  /** True only if the *requested* normalized slug is available */
  available: boolean;
  /** Message to show user (optional) */
  message?: string;
  /** Always a valid, normalized slug (or undefined on hard failure) */
  normalized?: string;
  /**
   * If requested slug is taken, this will be an available alternative (e.g. slug-1, slug-2, ...)
   * If requested slug is available, this will equal the normalized slug.
   */
  suggestedSlug?: string;
};

export async function checkStoreSlugAvailability(slug: string): Promise<CheckSlugResult> {
  // Validate slug using the existing store schema's slug rule
  const slugValidator = storeSchema.pick({ slug: true });
  const parsed = slugValidator.safeParse({ slug });

  if (!parsed.success) {
    return {
      available: false,
      message: parsed.error.issues[0]?.message || "Invalid slug",
    };
  }

  const normalized = parsed.data.slug;

  // Reserved slugs are never available
  if (isReservedSlug(normalized)) {
    // Try to offer a helpful suggestion if possible
    const suggested = `${normalized}-store`;
    return {
      available: false,
      normalized,
      suggestedSlug: suggested,
      message: "That slug is reserved. Please choose a different slug.",
    };
  }

  try {
    // Check requested slug
    const [existing] = await db.select().from(stores).where(eq(stores.slug, normalized));
    if (!existing) {
      return { available: true, normalized, suggestedSlug: normalized };
    }

    // Auto-increment suggestions: normalized-1, normalized-2, ...
    const MAX_ATTEMPTS = 500; // safeguard
    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
      const candidate = `${normalized}-${i}`;
      const [hit] = await db.select().from(stores).where(eq(stores.slug, candidate));
      if (!hit) {
        return {
          available: false,
          normalized,
          suggestedSlug: candidate,
          message: "That slug is already taken",
        };
      }
    }

    return {
      available: false,
      normalized,
      message: "Unable to find an available slug. Please try a different name.",
    };
  } catch (err) {
    console.error("checkStoreSlugAvailability error", err);
    return { available: false, normalized, message: "Failed to check slug availability" };
  }
}

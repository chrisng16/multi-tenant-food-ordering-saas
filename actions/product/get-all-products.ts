"use server";

import { db } from "@/db";
import { Product, products } from "@/db/schema";
import type { ActionResult } from "@/types/actions/action-result";
import { eq } from "drizzle-orm";

export async function getAllProducts(storeId: string): Promise<ActionResult<Product[]>> {
  if (!storeId) {
    return {
      ok: false,
      error: { code: "UNAUTHORIZED", message: "Store ID is required", status: 401 },
    };
  }

  try {
    const rows = await db.select().from(products).where(eq(products.storeId, storeId));
    return { ok: true, data: rows };
  } catch (err) {

    return {
      ok: false,
      error: { code: "INTERNAL", message: "Failed to fetch products", status: 500 },
    };
  }
}

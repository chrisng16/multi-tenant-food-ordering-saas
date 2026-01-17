"use server"
import { db } from "@/db";
import { stores } from "@/db/schema";
import { StoreSchema } from "@/schemas/store";

export async function createStore(storeData: StoreSchema) {
    return await db.insert(stores).values(storeData).returning();
}
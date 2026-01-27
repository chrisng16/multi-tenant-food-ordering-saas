import { defineConfig } from "drizzle-kit";
export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL || "postgresql://postgres.ocwcabdccvnnrhtlbnko:Ha6bz78QpdsMTiTh@aws-1-us-east-2.pooler.supabase.com:6543/postgres",
    }
});

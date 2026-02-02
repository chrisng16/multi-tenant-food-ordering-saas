ALTER TABLE "order_item_options" ALTER COLUMN "price_modifier" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "base_price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "total_price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "product_options" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_store_id_idx" ON "products" USING btree ("store_id");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_store_id_slug_unique" UNIQUE("store_id","slug");
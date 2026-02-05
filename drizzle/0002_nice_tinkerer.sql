ALTER TABLE "products" RENAME COLUMN "image_url" TO "images";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category_id" SET NOT NULL;
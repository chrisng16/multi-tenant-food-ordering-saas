CREATE TYPE "public"."image_tag" AS ENUM('logo', 'product', 'banner', 'profile');--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"product_id" uuid,
	"tag" "image_tag" NOT NULL,
	"filename" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"key" text NOT NULL,
	"size" integer NOT NULL,
	"mime_type" varchar(50) NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "images_store_tag_idx" ON "images" USING btree ("store_id","tag");--> statement-breakpoint
CREATE INDEX "images_store_product_idx" ON "images" USING btree ("store_id","product_id");--> statement-breakpoint
CREATE INDEX "images_key_idx" ON "images" USING btree ("key");--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "images";
CREATE TYPE "public"."day_of_week" AS ENUM('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat');--> statement-breakpoint
CREATE TYPE "public"."override_status" AS ENUM('closed', 'open', 'open24');--> statement-breakpoint
CREATE TABLE "store_date_overrides_flat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"local_date" text NOT NULL,
	"status" "override_status" NOT NULL,
	"start_min" integer,
	"end_min" integer,
	"label" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "override_flat_unique_range" UNIQUE("store_id","local_date","start_min","end_min")
);
--> statement-breakpoint
CREATE TABLE "store_weekly_ranges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"start_min" integer NOT NULL,
	"end_min" integer NOT NULL,
	"label" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "time_zone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "store_date_overrides_flat" ADD CONSTRAINT "store_date_overrides_flat_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_weekly_ranges" ADD CONSTRAINT "store_weekly_ranges_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "override_flat_store_date_idx" ON "store_date_overrides_flat" USING btree ("store_id","local_date","start_min");--> statement-breakpoint
CREATE INDEX "weekly_ranges_store_day_idx" ON "store_weekly_ranges" USING btree ("store_id","day_of_week","start_min");--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stores_user_id_idx" ON "stores" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stores_slug_idx" ON "stores" USING btree ("slug");
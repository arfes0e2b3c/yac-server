ALTER TABLE "media_items" ALTER COLUMN "image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "visibility" SET DEFAULT 'public';--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "visibility" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_code" SET DATA TYPE varchar(255);
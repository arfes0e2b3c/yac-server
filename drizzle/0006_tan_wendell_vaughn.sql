ALTER TABLE "media_items" ALTER COLUMN "id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "post_tags" ALTER COLUMN "post_id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "post_tags" ALTER COLUMN "tag_id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "music" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "user_id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "media_item_id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "user_id" SET DATA TYPE varchar(36);
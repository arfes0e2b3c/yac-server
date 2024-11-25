ALTER TABLE "posts" DROP CONSTRAINT "posts_music_media_items_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN IF EXISTS "music";
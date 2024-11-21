DROP TABLE "post_tags";--> statement-breakpoint
ALTER TABLE "tags" RENAME TO "groups";--> statement-breakpoint
ALTER TABLE "groups" DROP CONSTRAINT "tags_name_unique";--> statement-breakpoint
ALTER TABLE "groups" DROP CONSTRAINT "tags_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "media_item_id" SET DEFAULT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups" ADD CONSTRAINT "groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_name_unique" UNIQUE("name");
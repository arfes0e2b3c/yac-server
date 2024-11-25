DROP TABLE "post_groups";--> statement-breakpoint
ALTER TABLE "groups" RENAME TO "tags";--> statement-breakpoint
ALTER TABLE "tags" DROP CONSTRAINT "groups_name_unique";--> statement-breakpoint
ALTER TABLE "tags" DROP CONSTRAINT "groups_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_name_unique" UNIQUE("name");
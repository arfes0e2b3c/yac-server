CREATE TABLE IF NOT EXISTS "post_groups" (
	"post_id" varchar(36) NOT NULL,
	"group_id" varchar(36) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp DEFAULT NULL,
	CONSTRAINT "post_groups_post_id_group_id_pk" PRIMARY KEY("post_id","group_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_groups" ADD CONSTRAINT "post_groups_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_groups" ADD CONSTRAINT "post_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "users" DROP CONSTRAINT "users_user_code_unique";--> statement-breakpoint
ALTER TABLE "user_settings" ALTER COLUMN "notification_time" SET DEFAULT '22:00';
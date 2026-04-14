CREATE TYPE "public"."appointment_status" AS ENUM('scheduled', 'completed', 'cancelled', 'no_show');--> statement-breakpoint
ALTER TABLE "clients" DROP CONSTRAINT "clients_whatsapp_unique";--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'scheduled'::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET DATA TYPE "public"."appointment_status" USING "status"::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "whatsapp" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "starts_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "owner_id" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "salon_id" text;--> statement-breakpoint
ALTER TABLE "verifications" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "start_time";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "end_time";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "price_cents";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "payment_method";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "google_event_id";
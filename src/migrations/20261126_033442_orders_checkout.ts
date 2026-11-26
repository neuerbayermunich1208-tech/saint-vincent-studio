import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_status" AS ENUM('pending_payment', 'awaiting_transfer', 'confirmed', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('cod', 'bank_transfer', 'payos');
  CREATE TYPE "public"."enum_orders_locale" AS ENUM('en', 'vi');
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"product_name" varchar NOT NULL,
  	"sku" varchar NOT NULL,
  	"variant_label" varchar,
  	"unit_price_vnd" numeric NOT NULL,
  	"quantity" numeric NOT NULL,
  	"line_total_vnd" numeric NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'awaiting_transfer' NOT NULL,
  	"payment_method" "enum_orders_payment_method" NOT NULL,
  	"customer_name" varchar NOT NULL,
  	"customer_phone" varchar NOT NULL,
  	"customer_email" varchar NOT NULL,
  	"shipping_address" varchar NOT NULL,
  	"shipping_ward" varchar,
  	"shipping_district" varchar,
  	"shipping_province" varchar NOT NULL,
  	"shipping_note" varchar,
  	"shipping_tracking_number" varchar,
  	"subtotal_vnd" numeric NOT NULL,
  	"shipping_vnd" numeric,
  	"total_vnd" numeric NOT NULL,
  	"payment_payos_order_code" numeric,
  	"payment_payos_payment_link_id" varchar,
  	"payment_paid_at" timestamp(3) with time zone,
  	"payment_reference" varchar,
  	"payment_checkout_url" varchar,
  	"internal_notes" varchar,
  	"locale" "enum_orders_locale",
  	"stock_reserved" boolean DEFAULT true,
  	"access_token" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "orders_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "checkout_payos" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "checkout_bank_transfer" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "checkout_cod" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "checkout_bank_bank_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "checkout_bank_account_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "checkout_bank_account_number" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "checkout_shipping_flat_vnd" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "checkout_free_shipping_over_vnd" numeric;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE UNIQUE INDEX "orders_payment_payment_payos_order_code_idx" ON "orders" USING btree ("payment_payos_order_code");
  CREATE INDEX "orders_access_token_idx" ON "orders" USING btree ("access_token");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "orders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_orders_fk";
  
  DROP INDEX "payload_locked_documents_rels_orders_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "orders_id";
  ALTER TABLE "site_settings" DROP COLUMN "checkout_payos";
  ALTER TABLE "site_settings" DROP COLUMN "checkout_bank_transfer";
  ALTER TABLE "site_settings" DROP COLUMN "checkout_cod";
  ALTER TABLE "site_settings" DROP COLUMN "checkout_bank_bank_name";
  ALTER TABLE "site_settings" DROP COLUMN "checkout_bank_account_name";
  ALTER TABLE "site_settings" DROP COLUMN "checkout_bank_account_number";
  ALTER TABLE "site_settings" DROP COLUMN "checkout_shipping_flat_vnd";
  ALTER TABLE "site_settings" DROP COLUMN "checkout_free_shipping_over_vnd";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_locale";`)
}

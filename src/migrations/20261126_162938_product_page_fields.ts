import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_homepage_hero_layout" AS ENUM('portrait', 'wide');
  CREATE TYPE "public"."enum__homepage_v_version_hero_layout" AS ENUM('portrait', 'wide');
  CREATE TABLE "products_layout_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar
  );
  
  CREATE TABLE "products_layout_modules_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_layout_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "products_layout_notes_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_specs_extra" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_specs_extra_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_products_v_version_layout_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_layout_modules_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_layout_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_layout_notes_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_specs_extra" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specs_extra_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "products" ADD COLUMN "card_image_id" integer;
  ALTER TABLE "products" ADD COLUMN "plan_image_id" integer;
  ALTER TABLE "products_locales" ADD COLUMN "photo_note" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_card_image_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN "version_plan_image_id" integer;
  ALTER TABLE "_products_v_locales" ADD COLUMN "version_photo_note" varchar;
  ALTER TABLE "homepage" ADD COLUMN "hero_layout" "enum_homepage_hero_layout" DEFAULT 'portrait';
  ALTER TABLE "homepage" ADD COLUMN "hero_product_id" integer;
  ALTER TABLE "homepage_locales" ADD COLUMN "hero_label" varchar;
  ALTER TABLE "homepage_locales" ADD COLUMN "hero_note" varchar;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_hero_layout" "enum__homepage_v_version_hero_layout" DEFAULT 'portrait';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_hero_product_id" integer;
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_hero_label" varchar;
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_hero_note" varchar;
  ALTER TABLE "products_layout_modules" ADD CONSTRAINT "products_layout_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_layout_modules_locales" ADD CONSTRAINT "products_layout_modules_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_layout_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_layout_notes" ADD CONSTRAINT "products_layout_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_layout_notes_locales" ADD CONSTRAINT "products_layout_notes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_layout_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_extra" ADD CONSTRAINT "products_specs_extra_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_extra_locales" ADD CONSTRAINT "products_specs_extra_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specs_extra"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_layout_modules" ADD CONSTRAINT "_products_v_version_layout_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_layout_modules_locales" ADD CONSTRAINT "_products_v_version_layout_modules_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_layout_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_layout_notes" ADD CONSTRAINT "_products_v_version_layout_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_layout_notes_locales" ADD CONSTRAINT "_products_v_version_layout_notes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_layout_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_extra" ADD CONSTRAINT "_products_v_version_specs_extra_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_extra_locales" ADD CONSTRAINT "_products_v_version_specs_extra_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_specs_extra"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_layout_modules_order_idx" ON "products_layout_modules" USING btree ("_order");
  CREATE INDEX "products_layout_modules_parent_id_idx" ON "products_layout_modules" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_layout_modules_locales_locale_parent_id_unique" ON "products_layout_modules_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_layout_modules_locales_parent_id_idx" ON "products_layout_modules_locales" USING btree ("_parent_id");
  CREATE INDEX "products_layout_notes_order_idx" ON "products_layout_notes" USING btree ("_order");
  CREATE INDEX "products_layout_notes_parent_id_idx" ON "products_layout_notes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_layout_notes_locales_locale_parent_id_unique" ON "products_layout_notes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_layout_notes_locales_parent_id_idx" ON "products_layout_notes_locales" USING btree ("_parent_id");
  CREATE INDEX "products_specs_extra_order_idx" ON "products_specs_extra" USING btree ("_order");
  CREATE INDEX "products_specs_extra_parent_id_idx" ON "products_specs_extra" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specs_extra_locales_locale_parent_id_unique" ON "products_specs_extra_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specs_extra_locales_parent_id_idx" ON "products_specs_extra_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_layout_modules_order_idx" ON "_products_v_version_layout_modules" USING btree ("_order");
  CREATE INDEX "_products_v_version_layout_modules_parent_id_idx" ON "_products_v_version_layout_modules" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_layout_modules_locales_locale_parent_id_" ON "_products_v_version_layout_modules_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_layout_modules_locales_parent_id_idx" ON "_products_v_version_layout_modules_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_layout_notes_order_idx" ON "_products_v_version_layout_notes" USING btree ("_order");
  CREATE INDEX "_products_v_version_layout_notes_parent_id_idx" ON "_products_v_version_layout_notes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_layout_notes_locales_locale_parent_id_un" ON "_products_v_version_layout_notes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_layout_notes_locales_parent_id_idx" ON "_products_v_version_layout_notes_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_specs_extra_order_idx" ON "_products_v_version_specs_extra" USING btree ("_order");
  CREATE INDEX "_products_v_version_specs_extra_parent_id_idx" ON "_products_v_version_specs_extra" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_specs_extra_locales_locale_parent_id_uni" ON "_products_v_version_specs_extra_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_specs_extra_locales_parent_id_idx" ON "_products_v_version_specs_extra_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_media_id_idx" ON "homepage_rels" USING btree ("media_id");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_media_id_idx" ON "_homepage_v_rels" USING btree ("media_id");
  ALTER TABLE "products" ADD CONSTRAINT "products_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_plan_image_id_media_id_fk" FOREIGN KEY ("plan_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_card_image_id_media_id_fk" FOREIGN KEY ("version_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_plan_image_id_media_id_fk" FOREIGN KEY ("version_plan_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_product_id_products_id_fk" FOREIGN KEY ("hero_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_product_id_products_id_fk" FOREIGN KEY ("version_hero_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_card_image_idx" ON "products" USING btree ("card_image_id");
  CREATE INDEX "products_plan_image_idx" ON "products" USING btree ("plan_image_id");
  CREATE INDEX "_products_v_version_version_card_image_idx" ON "_products_v" USING btree ("version_card_image_id");
  CREATE INDEX "_products_v_version_version_plan_image_idx" ON "_products_v" USING btree ("version_plan_image_id");
  CREATE INDEX "homepage_hero_product_idx" ON "homepage" USING btree ("hero_product_id");
  CREATE INDEX "_homepage_v_version_version_hero_product_idx" ON "_homepage_v" USING btree ("version_hero_product_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_layout_modules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_layout_modules_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_layout_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_layout_notes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_specs_extra" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_specs_extra_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_layout_modules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_layout_modules_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_layout_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_layout_notes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_specs_extra" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_specs_extra_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_layout_modules" CASCADE;
  DROP TABLE "products_layout_modules_locales" CASCADE;
  DROP TABLE "products_layout_notes" CASCADE;
  DROP TABLE "products_layout_notes_locales" CASCADE;
  DROP TABLE "products_specs_extra" CASCADE;
  DROP TABLE "products_specs_extra_locales" CASCADE;
  DROP TABLE "_products_v_version_layout_modules" CASCADE;
  DROP TABLE "_products_v_version_layout_modules_locales" CASCADE;
  DROP TABLE "_products_v_version_layout_notes" CASCADE;
  DROP TABLE "_products_v_version_layout_notes_locales" CASCADE;
  DROP TABLE "_products_v_version_specs_extra" CASCADE;
  DROP TABLE "_products_v_version_specs_extra_locales" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  ALTER TABLE "products" DROP CONSTRAINT "products_card_image_id_media_id_fk";
  
  ALTER TABLE "products" DROP CONSTRAINT "products_plan_image_id_media_id_fk";
  
  ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_card_image_id_media_id_fk";
  
  ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_plan_image_id_media_id_fk";
  
  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_hero_product_id_products_id_fk";
  
  ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_hero_product_id_products_id_fk";
  
  DROP INDEX "products_card_image_idx";
  DROP INDEX "products_plan_image_idx";
  DROP INDEX "_products_v_version_version_card_image_idx";
  DROP INDEX "_products_v_version_version_plan_image_idx";
  DROP INDEX "homepage_hero_product_idx";
  DROP INDEX "_homepage_v_version_version_hero_product_idx";
  ALTER TABLE "products" DROP COLUMN "card_image_id";
  ALTER TABLE "products" DROP COLUMN "plan_image_id";
  ALTER TABLE "products_locales" DROP COLUMN "photo_note";
  ALTER TABLE "_products_v" DROP COLUMN "version_card_image_id";
  ALTER TABLE "_products_v" DROP COLUMN "version_plan_image_id";
  ALTER TABLE "_products_v_locales" DROP COLUMN "version_photo_note";
  ALTER TABLE "homepage" DROP COLUMN "hero_layout";
  ALTER TABLE "homepage" DROP COLUMN "hero_product_id";
  ALTER TABLE "homepage_locales" DROP COLUMN "hero_label";
  ALTER TABLE "homepage_locales" DROP COLUMN "hero_note";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_hero_layout";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_hero_product_id";
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_hero_label";
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_hero_note";
  DROP TYPE "public"."enum_homepage_hero_layout";
  DROP TYPE "public"."enum__homepage_v_version_hero_layout";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_products_assembly_difficulty" AS ENUM('easy', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_products_product_type" AS ENUM('diorama', 'model_kit', 'lighting', 'object', 'edition', 'other');
  CREATE TYPE "public"."enum_products_dev_status" AS ENUM('concept', 'in_development', 'prototype', 'available', 'archived');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_assembly_difficulty" AS ENUM('easy', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum__products_v_version_product_type" AS ENUM('diorama', 'model_kit', 'lighting', 'object', 'edition', 'other');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_releases_stage" AS ENUM('concept', 'design', 'prototype', 'refine', 'production');
  CREATE TYPE "public"."enum_journal_category" AS ENUM('behind', 'experiments', 'development', 'announcement', 'assembly', 'inspiration');
  CREATE TYPE "public"."enum_journal_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journal_v_version_category" AS ENUM('behind', 'experiments', 'development', 'announcement', 'assembly', 'inspiration');
  CREATE TYPE "public"."enum__journal_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journal_v_published_locale" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_pages_section" AS ENUM('legal', 'support');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_section" AS ENUM('legal', 'support');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_subscribers_locale" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_subscribers_status" AS ENUM('pending', 'subscribed', 'unsubscribed');
  CREATE TYPE "public"."enum_inquiries_topic" AS ENUM('general', 'product', 'collaboration', 'press', 'order');
  CREATE TYPE "public"."enum_inquiries_locale" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'replied', 'closed');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('owner', 'editor', 'fulfilment');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_published_locale" AS ENUM('en', 'vi');
  CREATE TYPE "public"."enum_site_settings_mode" AS ENUM('prelaunch', 'commerce');
  CREATE TYPE "public"."enum_site_settings_default_currency" AS ENUM('VND', 'USD');
  CREATE TABLE "products_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"x" numeric,
  	"y" numeric
  );
  
  CREATE TABLE "products_hotspots_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_specs_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_specs_colors_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_specs_included_components" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_specs_included_components_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_assembly_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "products_assembly_steps_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sku" varchar,
  	"price_vnd" numeric,
  	"price_usd" numeric,
  	"stock" numeric DEFAULT 0
  );
  
  CREATE TABLE "products_variants_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"specs_width_mm" numeric,
  	"specs_depth_mm" numeric,
  	"specs_height_mm" numeric,
  	"specs_weight_g" numeric,
  	"specs_scale" varchar,
  	"lighting_color_temperature" varchar,
  	"assembly_requires_assembly" boolean DEFAULT false,
  	"assembly_difficulty" "enum_products_assembly_difficulty",
  	"assembly_manual_id" integer,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"slug" varchar,
  	"catalogue_number" varchar,
  	"product_type" "enum_products_product_type" DEFAULT 'diorama',
  	"status" "enum_products_dev_status" DEFAULT 'concept',
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar,
  	"tagline" varchar,
  	"story" jsonb,
  	"specs_materials" varchar,
  	"specs_finish" varchar,
  	"specs_packaging" varchar,
  	"specs_care" varchar,
  	"lighting_light_source" varchar,
  	"lighting_power" varchar,
  	"lighting_wattage" varchar,
  	"lighting_dimming" varchar,
  	"lighting_safety" varchar,
  	"assembly_time" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"products_id" integer,
  	"product_collections_id" integer
  );
  
  CREATE TABLE "_products_v_version_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"x" numeric,
  	"y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_hotspots_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_specs_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specs_colors_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_specs_included_components" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specs_included_components_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_assembly_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_assembly_steps_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"sku" varchar,
  	"price_vnd" numeric,
  	"price_usd" numeric,
  	"stock" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_variants_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_video_id" integer,
  	"version_specs_width_mm" numeric,
  	"version_specs_depth_mm" numeric,
  	"version_specs_height_mm" numeric,
  	"version_specs_weight_g" numeric,
  	"version_specs_scale" varchar,
  	"version_lighting_color_temperature" varchar,
  	"version_assembly_requires_assembly" boolean DEFAULT false,
  	"version_assembly_difficulty" "enum__products_v_version_assembly_difficulty",
  	"version_assembly_manual_id" integer,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_catalogue_number" varchar,
  	"version_product_type" "enum__products_v_version_product_type" DEFAULT 'diorama',
  	"version_status" "enum_products_dev_status" DEFAULT 'concept',
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_name" varchar,
  	"version_tagline" varchar,
  	"version_story" jsonb,
  	"version_specs_materials" varchar,
  	"version_specs_finish" varchar,
  	"version_specs_packaging" varchar,
  	"version_specs_care" varchar,
  	"version_lighting_light_source" varchar,
  	"version_lighting_power" varchar,
  	"version_lighting_wattage" varchar,
  	"version_lighting_dimming" varchar,
  	"version_lighting_safety" varchar,
  	"version_assembly_time" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"products_id" integer,
  	"product_collections_id" integer
  );
  
  CREATE TABLE "product_collections_themes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "product_collections_themes_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "product_collections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"code" varchar,
  	"visible" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"parent_id" integer,
  	"cover_id" integer,
  	"collector_mode" boolean DEFAULT false,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_collections_locales" (
  	"name" varchar NOT NULL,
  	"summary" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "releases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"collection_id" integer,
  	"catalogue_number" varchar,
  	"stage" "enum_releases_stage" DEFAULT 'concept' NOT NULL,
  	"release_date" timestamp(3) with time zone,
  	"visible" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "releases_locales" (
  	"title" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "journal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "enum_journal_category",
  	"cover_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journal_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "journal_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "journal_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "_journal_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "enum__journal_v_version_category",
  	"version_cover_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journal_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__journal_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_journal_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_journal_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"section" "enum_pages_section" DEFAULT 'support',
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_section" "enum__pages_v_version_section" DEFAULT 'support',
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_concept" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"locale" "enum_subscribers_locale" DEFAULT 'en',
  	"source" varchar,
  	"status" "enum_subscribers_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"topic" "enum_inquiries_topic" DEFAULT 'general',
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"locale" "enum_inquiries_locale",
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"product_collections_id" integer,
  	"releases_id" integer,
  	"journal_id" integer,
  	"pages_id" integer,
  	"media_id" integer,
  	"subscribers_id" integer,
  	"inquiries_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"italic" boolean DEFAULT false,
  	"indent" boolean DEFAULT false
  );
  
  CREATE TABLE "homepage_hero_lines_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_pillars_locales" (
  	"label" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"featured_product_id" integer,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_locales" (
  	"hero_lede" varchar,
  	"intro_heading" varchar,
  	"intro_statement" varchar,
  	"closing_statement" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_version_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"italic" boolean DEFAULT false,
  	"indent" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_hero_lines_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_version_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_pillars_locales" (
  	"label" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_image_id" integer,
  	"version_featured_product_id" integer,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__homepage_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_homepage_v_locales" (
  	"version_hero_lede" varchar,
  	"version_intro_heading" varchar,
  	"version_intro_statement" varchar,
  	"version_closing_statement" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mode" "enum_site_settings_mode" DEFAULT 'prelaunch' NOT NULL,
  	"features_journal" boolean DEFAULT false,
  	"features_shop" boolean DEFAULT false,
  	"features_search" boolean DEFAULT false,
  	"features_wishlist" boolean DEFAULT true,
  	"features_modular_preview" boolean DEFAULT true,
  	"contact_email" varchar DEFAULT 'hello@saintvincent.studio',
  	"contact_instagram" varchar,
  	"contact_tiktok" varchar,
  	"contact_facebook" varchar,
  	"default_currency" "enum_site_settings_default_currency" DEFAULT 'VND',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "products_hotspots" ADD CONSTRAINT "products_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_hotspots_locales" ADD CONSTRAINT "products_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_colors" ADD CONSTRAINT "products_specs_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_colors_locales" ADD CONSTRAINT "products_specs_colors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specs_colors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_included_components" ADD CONSTRAINT "products_specs_included_components_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_included_components_locales" ADD CONSTRAINT "products_specs_included_components_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specs_included_components"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_assembly_steps" ADD CONSTRAINT "products_assembly_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_assembly_steps" ADD CONSTRAINT "products_assembly_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_assembly_steps_locales" ADD CONSTRAINT "products_assembly_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_assembly_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants_locales" ADD CONSTRAINT "products_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_assembly_manual_id_media_id_fk" FOREIGN KEY ("assembly_manual_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_product_collections_fk" FOREIGN KEY ("product_collections_id") REFERENCES "public"."product_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_hotspots" ADD CONSTRAINT "_products_v_version_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_hotspots_locales" ADD CONSTRAINT "_products_v_version_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_colors" ADD CONSTRAINT "_products_v_version_specs_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_colors_locales" ADD CONSTRAINT "_products_v_version_specs_colors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_specs_colors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_included_components" ADD CONSTRAINT "_products_v_version_specs_included_components_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_included_components_locales" ADD CONSTRAINT "_products_v_version_specs_included_components_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_specs_included_components"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_assembly_steps" ADD CONSTRAINT "_products_v_version_assembly_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_assembly_steps" ADD CONSTRAINT "_products_v_version_assembly_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_assembly_steps_locales" ADD CONSTRAINT "_products_v_version_assembly_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_assembly_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants" ADD CONSTRAINT "_products_v_version_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_variants_locales" ADD CONSTRAINT "_products_v_version_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_video_id_media_id_fk" FOREIGN KEY ("version_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_assembly_manual_id_media_id_fk" FOREIGN KEY ("version_assembly_manual_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_product_collections_fk" FOREIGN KEY ("product_collections_id") REFERENCES "public"."product_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_collections_themes" ADD CONSTRAINT "product_collections_themes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_collections_themes_locales" ADD CONSTRAINT "product_collections_themes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_collections_themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_parent_id_product_collections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_collections_locales" ADD CONSTRAINT "product_collections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "releases" ADD CONSTRAINT "releases_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "releases" ADD CONSTRAINT "releases_collection_id_product_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."product_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "releases_locales" ADD CONSTRAINT "releases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."releases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal" ADD CONSTRAINT "journal_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal" ADD CONSTRAINT "journal_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_locales" ADD CONSTRAINT "journal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_rels" ADD CONSTRAINT "journal_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_rels" ADD CONSTRAINT "journal_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_v" ADD CONSTRAINT "_journal_v_parent_id_journal_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_v" ADD CONSTRAINT "_journal_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_v" ADD CONSTRAINT "_journal_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_v_locales" ADD CONSTRAINT "_journal_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_v_rels" ADD CONSTRAINT "_journal_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_journal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_v_rels" ADD CONSTRAINT "_journal_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_collections_fk" FOREIGN KEY ("product_collections_id") REFERENCES "public"."product_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_releases_fk" FOREIGN KEY ("releases_id") REFERENCES "public"."releases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journal_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_lines" ADD CONSTRAINT "homepage_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_lines_locales" ADD CONSTRAINT "homepage_hero_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_hero_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_pillars" ADD CONSTRAINT "homepage_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_pillars_locales" ADD CONSTRAINT "homepage_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_featured_product_id_products_id_fk" FOREIGN KEY ("featured_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_hero_lines" ADD CONSTRAINT "_homepage_v_version_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_hero_lines_locales" ADD CONSTRAINT "_homepage_v_version_hero_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_hero_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_pillars" ADD CONSTRAINT "_homepage_v_version_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_pillars_locales" ADD CONSTRAINT "_homepage_v_version_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_featured_product_id_products_id_fk" FOREIGN KEY ("version_featured_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_locales" ADD CONSTRAINT "_homepage_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_hotspots_order_idx" ON "products_hotspots" USING btree ("_order");
  CREATE INDEX "products_hotspots_parent_id_idx" ON "products_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_hotspots_locales_locale_parent_id_unique" ON "products_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_hotspots_locales_parent_id_idx" ON "products_hotspots_locales" USING btree ("_parent_id");
  CREATE INDEX "products_specs_colors_order_idx" ON "products_specs_colors" USING btree ("_order");
  CREATE INDEX "products_specs_colors_parent_id_idx" ON "products_specs_colors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specs_colors_locales_locale_parent_id_unique" ON "products_specs_colors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specs_colors_locales_parent_id_idx" ON "products_specs_colors_locales" USING btree ("_parent_id");
  CREATE INDEX "products_specs_included_components_order_idx" ON "products_specs_included_components" USING btree ("_order");
  CREATE INDEX "products_specs_included_components_parent_id_idx" ON "products_specs_included_components" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specs_included_components_locales_locale_parent_id_" ON "products_specs_included_components_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specs_included_components_locales_parent_id_idx" ON "products_specs_included_components_locales" USING btree ("_parent_id");
  CREATE INDEX "products_assembly_steps_order_idx" ON "products_assembly_steps" USING btree ("_order");
  CREATE INDEX "products_assembly_steps_parent_id_idx" ON "products_assembly_steps" USING btree ("_parent_id");
  CREATE INDEX "products_assembly_steps_image_idx" ON "products_assembly_steps" USING btree ("image_id");
  CREATE UNIQUE INDEX "products_assembly_steps_locales_locale_parent_id_unique" ON "products_assembly_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_assembly_steps_locales_parent_id_idx" ON "products_assembly_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_variants_locales_locale_parent_id_unique" ON "products_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_variants_locales_parent_id_idx" ON "products_variants_locales" USING btree ("_parent_id");
  CREATE INDEX "products_video_idx" ON "products" USING btree ("video_id");
  CREATE INDEX "products_assembly_assembly_manual_idx" ON "products" USING btree ("assembly_manual_id");
  CREATE INDEX "products_seo_seo_image_idx" ON "products" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX "products_rels_product_collections_id_idx" ON "products_rels" USING btree ("product_collections_id");
  CREATE INDEX "_products_v_version_hotspots_order_idx" ON "_products_v_version_hotspots" USING btree ("_order");
  CREATE INDEX "_products_v_version_hotspots_parent_id_idx" ON "_products_v_version_hotspots" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_hotspots_locales_locale_parent_id_unique" ON "_products_v_version_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_hotspots_locales_parent_id_idx" ON "_products_v_version_hotspots_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_specs_colors_order_idx" ON "_products_v_version_specs_colors" USING btree ("_order");
  CREATE INDEX "_products_v_version_specs_colors_parent_id_idx" ON "_products_v_version_specs_colors" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_specs_colors_locales_locale_parent_id_un" ON "_products_v_version_specs_colors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_specs_colors_locales_parent_id_idx" ON "_products_v_version_specs_colors_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_specs_included_components_order_idx" ON "_products_v_version_specs_included_components" USING btree ("_order");
  CREATE INDEX "_products_v_version_specs_included_components_parent_id_idx" ON "_products_v_version_specs_included_components" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_specs_included_components_locales_locale" ON "_products_v_version_specs_included_components_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_specs_included_components_locales_pa_idx" ON "_products_v_version_specs_included_components_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_assembly_steps_order_idx" ON "_products_v_version_assembly_steps" USING btree ("_order");
  CREATE INDEX "_products_v_version_assembly_steps_parent_id_idx" ON "_products_v_version_assembly_steps" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_assembly_steps_image_idx" ON "_products_v_version_assembly_steps" USING btree ("image_id");
  CREATE UNIQUE INDEX "_products_v_version_assembly_steps_locales_locale_parent_id_" ON "_products_v_version_assembly_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_assembly_steps_locales_parent_id_idx" ON "_products_v_version_assembly_steps_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_variants_order_idx" ON "_products_v_version_variants" USING btree ("_order");
  CREATE INDEX "_products_v_version_variants_parent_id_idx" ON "_products_v_version_variants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_variants_locales_locale_parent_id_unique" ON "_products_v_version_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_variants_locales_parent_id_idx" ON "_products_v_version_variants_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_video_idx" ON "_products_v" USING btree ("version_video_id");
  CREATE INDEX "_products_v_version_assembly_version_assembly_manual_idx" ON "_products_v" USING btree ("version_assembly_manual_id");
  CREATE INDEX "_products_v_version_seo_version_seo_image_idx" ON "_products_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_locales_parent_id_idx" ON "_products_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id");
  CREATE INDEX "_products_v_rels_product_collections_id_idx" ON "_products_v_rels" USING btree ("product_collections_id");
  CREATE INDEX "product_collections_themes_order_idx" ON "product_collections_themes" USING btree ("_order");
  CREATE INDEX "product_collections_themes_parent_id_idx" ON "product_collections_themes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "product_collections_themes_locales_locale_parent_id_unique" ON "product_collections_themes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "product_collections_themes_locales_parent_id_idx" ON "product_collections_themes_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "product_collections_slug_idx" ON "product_collections" USING btree ("slug");
  CREATE INDEX "product_collections_parent_idx" ON "product_collections" USING btree ("parent_id");
  CREATE INDEX "product_collections_cover_idx" ON "product_collections" USING btree ("cover_id");
  CREATE INDEX "product_collections_seo_seo_image_idx" ON "product_collections" USING btree ("seo_image_id");
  CREATE INDEX "product_collections_updated_at_idx" ON "product_collections" USING btree ("updated_at");
  CREATE INDEX "product_collections_created_at_idx" ON "product_collections" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_collections_locales_locale_parent_id_unique" ON "product_collections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "product_collections_locales_parent_id_idx" ON "product_collections_locales" USING btree ("_parent_id");
  CREATE INDEX "releases_product_idx" ON "releases" USING btree ("product_id");
  CREATE INDEX "releases_collection_idx" ON "releases" USING btree ("collection_id");
  CREATE INDEX "releases_updated_at_idx" ON "releases" USING btree ("updated_at");
  CREATE INDEX "releases_created_at_idx" ON "releases" USING btree ("created_at");
  CREATE UNIQUE INDEX "releases_locales_locale_parent_id_unique" ON "releases_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "releases_locales_parent_id_idx" ON "releases_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "journal_slug_idx" ON "journal" USING btree ("slug");
  CREATE INDEX "journal_cover_idx" ON "journal" USING btree ("cover_id");
  CREATE INDEX "journal_seo_seo_image_idx" ON "journal" USING btree ("seo_image_id");
  CREATE INDEX "journal_updated_at_idx" ON "journal" USING btree ("updated_at");
  CREATE INDEX "journal_created_at_idx" ON "journal" USING btree ("created_at");
  CREATE INDEX "journal__status_idx" ON "journal" USING btree ("_status");
  CREATE UNIQUE INDEX "journal_locales_locale_parent_id_unique" ON "journal_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "journal_locales_parent_id_idx" ON "journal_locales" USING btree ("_parent_id");
  CREATE INDEX "journal_rels_order_idx" ON "journal_rels" USING btree ("order");
  CREATE INDEX "journal_rels_parent_idx" ON "journal_rels" USING btree ("parent_id");
  CREATE INDEX "journal_rels_path_idx" ON "journal_rels" USING btree ("path");
  CREATE INDEX "journal_rels_products_id_idx" ON "journal_rels" USING btree ("products_id");
  CREATE INDEX "_journal_v_parent_idx" ON "_journal_v" USING btree ("parent_id");
  CREATE INDEX "_journal_v_version_version_slug_idx" ON "_journal_v" USING btree ("version_slug");
  CREATE INDEX "_journal_v_version_version_cover_idx" ON "_journal_v" USING btree ("version_cover_id");
  CREATE INDEX "_journal_v_version_seo_version_seo_image_idx" ON "_journal_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_journal_v_version_version_updated_at_idx" ON "_journal_v" USING btree ("version_updated_at");
  CREATE INDEX "_journal_v_version_version_created_at_idx" ON "_journal_v" USING btree ("version_created_at");
  CREATE INDEX "_journal_v_version_version__status_idx" ON "_journal_v" USING btree ("version__status");
  CREATE INDEX "_journal_v_created_at_idx" ON "_journal_v" USING btree ("created_at");
  CREATE INDEX "_journal_v_updated_at_idx" ON "_journal_v" USING btree ("updated_at");
  CREATE INDEX "_journal_v_snapshot_idx" ON "_journal_v" USING btree ("snapshot");
  CREATE INDEX "_journal_v_published_locale_idx" ON "_journal_v" USING btree ("published_locale");
  CREATE INDEX "_journal_v_latest_idx" ON "_journal_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_journal_v_locales_locale_parent_id_unique" ON "_journal_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_journal_v_locales_parent_id_idx" ON "_journal_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_journal_v_rels_order_idx" ON "_journal_v_rels" USING btree ("order");
  CREATE INDEX "_journal_v_rels_parent_idx" ON "_journal_v_rels" USING btree ("parent_id");
  CREATE INDEX "_journal_v_rels_path_idx" ON "_journal_v_rels" USING btree ("path");
  CREATE INDEX "_journal_v_rels_products_id_idx" ON "_journal_v_rels" USING btree ("products_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_product_collections_id_idx" ON "payload_locked_documents_rels" USING btree ("product_collections_id");
  CREATE INDEX "payload_locked_documents_rels_releases_id_idx" ON "payload_locked_documents_rels" USING btree ("releases_id");
  CREATE INDEX "payload_locked_documents_rels_journal_id_idx" ON "payload_locked_documents_rels" USING btree ("journal_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_hero_lines_order_idx" ON "homepage_hero_lines" USING btree ("_order");
  CREATE INDEX "homepage_hero_lines_parent_id_idx" ON "homepage_hero_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_hero_lines_locales_locale_parent_id_unique" ON "homepage_hero_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_hero_lines_locales_parent_id_idx" ON "homepage_hero_lines_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_pillars_order_idx" ON "homepage_pillars" USING btree ("_order");
  CREATE INDEX "homepage_pillars_parent_id_idx" ON "homepage_pillars" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_pillars_locales_locale_parent_id_unique" ON "homepage_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_pillars_locales_parent_id_idx" ON "homepage_pillars_locales" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "homepage_featured_product_idx" ON "homepage" USING btree ("featured_product_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "homepage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_locales_parent_id_idx" ON "homepage_locales" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_hero_lines_order_idx" ON "_homepage_v_version_hero_lines" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_hero_lines_parent_id_idx" ON "_homepage_v_version_hero_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_homepage_v_version_hero_lines_locales_locale_parent_id_uniq" ON "_homepage_v_version_hero_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_hero_lines_locales_parent_id_idx" ON "_homepage_v_version_hero_lines_locales" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_pillars_order_idx" ON "_homepage_v_version_pillars" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_pillars_parent_id_idx" ON "_homepage_v_version_pillars" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_homepage_v_version_pillars_locales_locale_parent_id_unique" ON "_homepage_v_version_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_pillars_locales_parent_id_idx" ON "_homepage_v_version_pillars_locales" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_version_hero_image_idx" ON "_homepage_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_homepage_v_version_version_featured_product_idx" ON "_homepage_v" USING btree ("version_featured_product_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_snapshot_idx" ON "_homepage_v" USING btree ("snapshot");
  CREATE INDEX "_homepage_v_published_locale_idx" ON "_homepage_v" USING btree ("published_locale");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_homepage_v_locales_locale_parent_id_unique" ON "_homepage_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_locales_parent_id_idx" ON "_homepage_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_hotspots" CASCADE;
  DROP TABLE "products_hotspots_locales" CASCADE;
  DROP TABLE "products_specs_colors" CASCADE;
  DROP TABLE "products_specs_colors_locales" CASCADE;
  DROP TABLE "products_specs_included_components" CASCADE;
  DROP TABLE "products_specs_included_components_locales" CASCADE;
  DROP TABLE "products_assembly_steps" CASCADE;
  DROP TABLE "products_assembly_steps_locales" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products_variants_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_hotspots" CASCADE;
  DROP TABLE "_products_v_version_hotspots_locales" CASCADE;
  DROP TABLE "_products_v_version_specs_colors" CASCADE;
  DROP TABLE "_products_v_version_specs_colors_locales" CASCADE;
  DROP TABLE "_products_v_version_specs_included_components" CASCADE;
  DROP TABLE "_products_v_version_specs_included_components_locales" CASCADE;
  DROP TABLE "_products_v_version_assembly_steps" CASCADE;
  DROP TABLE "_products_v_version_assembly_steps_locales" CASCADE;
  DROP TABLE "_products_v_version_variants" CASCADE;
  DROP TABLE "_products_v_version_variants_locales" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "product_collections_themes" CASCADE;
  DROP TABLE "product_collections_themes_locales" CASCADE;
  DROP TABLE "product_collections" CASCADE;
  DROP TABLE "product_collections_locales" CASCADE;
  DROP TABLE "releases" CASCADE;
  DROP TABLE "releases_locales" CASCADE;
  DROP TABLE "journal" CASCADE;
  DROP TABLE "journal_locales" CASCADE;
  DROP TABLE "journal_rels" CASCADE;
  DROP TABLE "_journal_v" CASCADE;
  DROP TABLE "_journal_v_locales" CASCADE;
  DROP TABLE "_journal_v_rels" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_hero_lines" CASCADE;
  DROP TABLE "homepage_hero_lines_locales" CASCADE;
  DROP TABLE "homepage_pillars" CASCADE;
  DROP TABLE "homepage_pillars_locales" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_locales" CASCADE;
  DROP TABLE "_homepage_v_version_hero_lines" CASCADE;
  DROP TABLE "_homepage_v_version_hero_lines_locales" CASCADE;
  DROP TABLE "_homepage_v_version_pillars" CASCADE;
  DROP TABLE "_homepage_v_version_pillars_locales" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_products_assembly_difficulty";
  DROP TYPE "public"."enum_products_product_type";
  DROP TYPE "public"."enum_products_dev_status";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_assembly_difficulty";
  DROP TYPE "public"."enum__products_v_version_product_type";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_releases_stage";
  DROP TYPE "public"."enum_journal_category";
  DROP TYPE "public"."enum_journal_status";
  DROP TYPE "public"."enum__journal_v_version_category";
  DROP TYPE "public"."enum__journal_v_version_status";
  DROP TYPE "public"."enum__journal_v_published_locale";
  DROP TYPE "public"."enum_pages_section";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_section";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_subscribers_locale";
  DROP TYPE "public"."enum_subscribers_status";
  DROP TYPE "public"."enum_inquiries_topic";
  DROP TYPE "public"."enum_inquiries_locale";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum__homepage_v_published_locale";
  DROP TYPE "public"."enum_site_settings_mode";
  DROP TYPE "public"."enum_site_settings_default_currency";`)
}

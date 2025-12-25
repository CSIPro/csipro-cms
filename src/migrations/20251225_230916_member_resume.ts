import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "resumes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
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
  	"focal_y" numeric
  );
  
  ALTER TABLE "miembros" ALTER COLUMN "short_name" SET NOT NULL;
  ALTER TABLE "miembros" ALTER COLUMN "subtitle" SET NOT NULL;
  ALTER TABLE "miembros" ADD COLUMN "resume_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resumes_id" integer;
  CREATE INDEX IF NOT EXISTS "resumes_updated_at_idx" ON "resumes" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "resumes_created_at_idx" ON "resumes" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "resumes_filename_idx" ON "resumes" USING btree ("filename");
  DO $$ BEGIN
   ALTER TABLE "miembros" ADD CONSTRAINT "miembros_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resumes_fk" FOREIGN KEY ("resumes_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "miembros_resume_idx" ON "miembros" USING btree ("resume_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_resumes_id_idx" ON "payload_locked_documents_rels" USING btree ("resumes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resumes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "resumes" CASCADE;
  ALTER TABLE "miembros" DROP CONSTRAINT "miembros_resume_id_resumes_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resumes_fk";
  
  DROP INDEX IF EXISTS "miembros_resume_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_resumes_id_idx";
  ALTER TABLE "miembros" ALTER COLUMN "short_name" DROP NOT NULL;
  ALTER TABLE "miembros" ALTER COLUMN "subtitle" DROP NOT NULL;
  ALTER TABLE "miembros" DROP COLUMN IF EXISTS "resume_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "resumes_id";`)
}

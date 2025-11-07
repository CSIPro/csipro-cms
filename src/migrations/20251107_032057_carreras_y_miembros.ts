import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_miembros_estado" AS ENUM('activo', 'egresado', 'inactivo');
  CREATE TABLE IF NOT EXISTS "miembros_intereses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"interes" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "miembros_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tecnologias_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "carreras" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"codigo" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "miembros" ADD COLUMN "fecha_nacimiento" timestamp(3) with time zone;
  ALTER TABLE "miembros" ADD COLUMN "sobre_mi" jsonb;
  ALTER TABLE "miembros" ADD COLUMN "estado" "enum_miembros_estado" DEFAULT 'activo';
  ALTER TABLE "miembros" ADD COLUMN "carrera_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "carreras_id" integer;
  DO $$ BEGIN
   ALTER TABLE "miembros_intereses" ADD CONSTRAINT "miembros_intereses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."miembros"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "miembros_rels" ADD CONSTRAINT "miembros_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."miembros"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "miembros_rels" ADD CONSTRAINT "miembros_rels_tecnologias_fk" FOREIGN KEY ("tecnologias_id") REFERENCES "public"."tecnologias"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "miembros_intereses_order_idx" ON "miembros_intereses" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "miembros_intereses_parent_id_idx" ON "miembros_intereses" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "miembros_rels_order_idx" ON "miembros_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "miembros_rels_parent_idx" ON "miembros_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "miembros_rels_path_idx" ON "miembros_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "miembros_rels_tecnologias_id_idx" ON "miembros_rels" USING btree ("tecnologias_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "carreras_codigo_idx" ON "carreras" USING btree ("codigo");
  CREATE UNIQUE INDEX IF NOT EXISTS "carreras_slug_idx" ON "carreras" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "carreras_updated_at_idx" ON "carreras" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "carreras_created_at_idx" ON "carreras" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "miembros" ADD CONSTRAINT "miembros_carrera_id_carreras_id_fk" FOREIGN KEY ("carrera_id") REFERENCES "public"."carreras"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_carreras_fk" FOREIGN KEY ("carreras_id") REFERENCES "public"."carreras"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "miembros_carrera_idx" ON "miembros" USING btree ("carrera_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_carreras_id_idx" ON "payload_locked_documents_rels" USING btree ("carreras_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "miembros_intereses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "miembros_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "carreras" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "miembros_intereses" CASCADE;
  DROP TABLE "miembros_rels" CASCADE;
  DROP TABLE "carreras" CASCADE;
  ALTER TABLE "miembros" DROP CONSTRAINT "miembros_carrera_id_carreras_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_carreras_fk";
  
  DROP INDEX IF EXISTS "miembros_carrera_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_carreras_id_idx";
  ALTER TABLE "miembros" DROP COLUMN IF EXISTS "fecha_nacimiento";
  ALTER TABLE "miembros" DROP COLUMN IF EXISTS "sobre_mi";
  ALTER TABLE "miembros" DROP COLUMN IF EXISTS "estado";
  ALTER TABLE "miembros" DROP COLUMN IF EXISTS "carrera_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "carreras_id";
  DROP TYPE "public"."enum_miembros_estado";`)
}

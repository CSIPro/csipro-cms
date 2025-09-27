import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "proyectos_participantes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"miembro_id" integer NOT NULL,
  	"rol_id" integer NOT NULL,
  	"descripcion" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "project_roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "proyectos_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "proyectos_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "project_roles_id" integer;
  DO $$ BEGIN
   ALTER TABLE "proyectos_participantes" ADD CONSTRAINT "proyectos_participantes_miembro_id_miembros_id_fk" FOREIGN KEY ("miembro_id") REFERENCES "public"."miembros"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "proyectos_participantes" ADD CONSTRAINT "proyectos_participantes_rol_id_project_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."project_roles"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "proyectos_participantes" ADD CONSTRAINT "proyectos_participantes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "proyectos_participantes_order_idx" ON "proyectos_participantes" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "proyectos_participantes_parent_id_idx" ON "proyectos_participantes" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "proyectos_participantes_miembro_idx" ON "proyectos_participantes" USING btree ("miembro_id");
  CREATE INDEX IF NOT EXISTS "proyectos_participantes_rol_idx" ON "proyectos_participantes" USING btree ("rol_id");
  CREATE INDEX IF NOT EXISTS "project_roles_updated_at_idx" ON "project_roles" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "project_roles_created_at_idx" ON "project_roles" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_roles_fk" FOREIGN KEY ("project_roles_id") REFERENCES "public"."project_roles"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_project_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("project_roles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "proyectos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"miembros_id" integer
  );
  
  ALTER TABLE "proyectos_participantes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "proyectos_participantes" CASCADE;
  DROP TABLE "project_roles" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_project_roles_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_project_roles_id_idx";
  DO $$ BEGIN
   ALTER TABLE "proyectos_rels" ADD CONSTRAINT "proyectos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "proyectos_rels" ADD CONSTRAINT "proyectos_rels_miembros_fk" FOREIGN KEY ("miembros_id") REFERENCES "public"."miembros"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "proyectos_rels_order_idx" ON "proyectos_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "proyectos_rels_parent_idx" ON "proyectos_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "proyectos_rels_path_idx" ON "proyectos_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "proyectos_rels_miembros_id_idx" ON "proyectos_rels" USING btree ("miembros_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "project_roles_id";`)
}

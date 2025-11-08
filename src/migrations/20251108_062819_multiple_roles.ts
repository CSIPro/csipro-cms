import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "proyectos_participantes_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rol_id" integer NOT NULL
  );
  
  ALTER TABLE "proyectos_participantes" DROP CONSTRAINT "proyectos_participantes_rol_id_project_roles_id_fk";
  
  DROP INDEX IF EXISTS "proyectos_participantes_rol_idx";
  DO $$ BEGIN
   ALTER TABLE "proyectos_participantes_roles" ADD CONSTRAINT "proyectos_participantes_roles_rol_id_project_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."project_roles"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "proyectos_participantes_roles" ADD CONSTRAINT "proyectos_participantes_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_participantes"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "proyectos_participantes_roles_order_idx" ON "proyectos_participantes_roles" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "proyectos_participantes_roles_parent_id_idx" ON "proyectos_participantes_roles" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "proyectos_participantes_roles_rol_idx" ON "proyectos_participantes_roles" USING btree ("rol_id");
  ALTER TABLE "proyectos_participantes" DROP COLUMN IF EXISTS "rol_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "proyectos_participantes_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "proyectos_participantes_roles" CASCADE;
  ALTER TABLE "proyectos_participantes" ADD COLUMN "rol_id" integer NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "proyectos_participantes" ADD CONSTRAINT "proyectos_participantes_rol_id_project_roles_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."project_roles"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "proyectos_participantes_rol_idx" ON "proyectos_participantes" USING btree ("rol_id");`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "miembros_redes" RENAME COLUMN "nombre_id" TO "red_id";
  ALTER TABLE "miembros_redes" DROP CONSTRAINT "miembros_redes_nombre_id_redes_sociales_id_fk";
  
  DROP INDEX IF EXISTS "miembros_redes_nombre_idx";
  DO $$ BEGIN
   ALTER TABLE "miembros_redes" ADD CONSTRAINT "miembros_redes_red_id_redes_sociales_id_fk" FOREIGN KEY ("red_id") REFERENCES "public"."redes_sociales"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "miembros_redes_red_idx" ON "miembros_redes" USING btree ("red_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "miembros_redes" RENAME COLUMN "red_id" TO "nombre_id";
  ALTER TABLE "miembros_redes" DROP CONSTRAINT "miembros_redes_red_id_redes_sociales_id_fk";
  
  DROP INDEX IF EXISTS "miembros_redes_red_idx";
  DO $$ BEGIN
   ALTER TABLE "miembros_redes" ADD CONSTRAINT "miembros_redes_nombre_id_redes_sociales_id_fk" FOREIGN KEY ("nombre_id") REFERENCES "public"."redes_sociales"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "miembros_redes_nombre_idx" ON "miembros_redes" USING btree ("nombre_id");`)
}

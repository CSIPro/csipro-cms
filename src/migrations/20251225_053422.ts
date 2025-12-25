import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "miembros" ADD COLUMN "short_name" varchar;
  ALTER TABLE "miembros" ADD COLUMN "subtitle" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "miembros" DROP COLUMN IF EXISTS "short_name";
  ALTER TABLE "miembros" DROP COLUMN IF EXISTS "subtitle";`)
}

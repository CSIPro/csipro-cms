import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "eventos" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "miembros" ADD COLUMN "portfolio" varchar;
  ALTER TABLE "proyectos" ADD COLUMN "slug" varchar NOT NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS "eventos_slug_idx" ON "eventos" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "miembros_portfolio_idx" ON "miembros" USING btree ("portfolio");
  CREATE UNIQUE INDEX IF NOT EXISTS "proyectos_slug_idx" ON "proyectos" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "eventos_slug_idx";
  DROP INDEX IF EXISTS "miembros_portfolio_idx";
  DROP INDEX IF EXISTS "proyectos_slug_idx";
  ALTER TABLE "eventos" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "miembros" DROP COLUMN IF EXISTS "portfolio";
  ALTER TABLE "proyectos" DROP COLUMN IF EXISTS "slug";`)
}

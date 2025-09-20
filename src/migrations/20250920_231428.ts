import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_proyectos_tipo_sistema" AS ENUM('Aplicación Móvil', 'Aplicación de Escritorio', 'Aplicación Web');
  CREATE TYPE "public"."enum_proyectos_estado" AS ENUM('Activo', 'Inactivo', 'Finalizado');
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
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
  
  CREATE TABLE IF NOT EXISTS "cargos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"descripcion" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "eventos_fechas_horas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fecha_hora" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "eventos_imagenes_secundarias" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "eventos_asistentes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"apellido" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"expediente" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "eventos_requisitos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre_requisito" jsonb NOT NULL,
  	"detalles" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "eventos_publicaciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo_publicacion" varchar NOT NULL,
  	"red_social_id" integer NOT NULL,
  	"link" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "eventos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tipo" varchar,
  	"titulo" varchar NOT NULL,
  	"enable_multi_dates" boolean DEFAULT false,
  	"fecha_unica" timestamp(3) with time zone,
  	"fecha_inicio" timestamp(3) with time zone NOT NULL,
  	"fecha_fin" timestamp(3) with time zone NOT NULL,
  	"lugar" varchar NOT NULL,
  	"duracion" numeric NOT NULL,
  	"cupos" numeric NOT NULL,
  	"imagen_principal_id" integer NOT NULL,
  	"descripcion" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "eventos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"miembros_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "miembros_redes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "miembros_fotos_secundarias" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "miembros" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombres" varchar NOT NULL,
  	"apellidos" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"fecha_entrada" timestamp(3) with time zone,
  	"fecha_salida" timestamp(3) with time zone,
  	"foto_id" integer NOT NULL,
  	"cargo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "proyectos_imagenes_secundarias" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "proyectos_tecnologias" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tecnologia_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "proyectos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"tipo_sistema" "enum_proyectos_tipo_sistema" NOT NULL,
  	"descripcion" jsonb,
  	"subtitulo" varchar NOT NULL,
  	"imagen_principal_id" integer NOT NULL,
  	"fecha_inicio" timestamp(3) with time zone NOT NULL,
  	"fecha_termino" timestamp(3) with time zone,
  	"estado" "enum_proyectos_estado" NOT NULL,
  	"url" varchar,
  	"github_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "proyectos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"miembros_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "redes_sociales" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"logo_monocromatico_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "tecnologias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"logo_monocromatico_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"cargos_id" integer,
  	"eventos_id" integer,
  	"miembros_id" integer,
  	"proyectos_id" integer,
  	"redes_sociales_id" integer,
  	"tecnologias_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "eventos_fechas_horas" ADD CONSTRAINT "eventos_fechas_horas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "eventos_imagenes_secundarias" ADD CONSTRAINT "eventos_imagenes_secundarias_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "eventos_imagenes_secundarias" ADD CONSTRAINT "eventos_imagenes_secundarias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "eventos_asistentes" ADD CONSTRAINT "eventos_asistentes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "eventos_requisitos" ADD CONSTRAINT "eventos_requisitos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "eventos_publicaciones" ADD CONSTRAINT "eventos_publicaciones_red_social_id_redes_sociales_id_fk" FOREIGN KEY ("red_social_id") REFERENCES "public"."redes_sociales"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "eventos_publicaciones" ADD CONSTRAINT "eventos_publicaciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "eventos" ADD CONSTRAINT "eventos_imagen_principal_id_media_id_fk" FOREIGN KEY ("imagen_principal_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "eventos_rels" ADD CONSTRAINT "eventos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "eventos_rels" ADD CONSTRAINT "eventos_rels_miembros_fk" FOREIGN KEY ("miembros_id") REFERENCES "public"."miembros"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "miembros_redes" ADD CONSTRAINT "miembros_redes_nombre_id_redes_sociales_id_fk" FOREIGN KEY ("nombre_id") REFERENCES "public"."redes_sociales"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "miembros_redes" ADD CONSTRAINT "miembros_redes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."miembros"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "miembros_fotos_secundarias" ADD CONSTRAINT "miembros_fotos_secundarias_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "miembros_fotos_secundarias" ADD CONSTRAINT "miembros_fotos_secundarias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."miembros"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "miembros" ADD CONSTRAINT "miembros_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "miembros" ADD CONSTRAINT "miembros_cargo_id_cargos_id_fk" FOREIGN KEY ("cargo_id") REFERENCES "public"."cargos"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "proyectos_imagenes_secundarias" ADD CONSTRAINT "proyectos_imagenes_secundarias_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "proyectos_imagenes_secundarias" ADD CONSTRAINT "proyectos_imagenes_secundarias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "proyectos_tecnologias" ADD CONSTRAINT "proyectos_tecnologias_tecnologia_id_tecnologias_id_fk" FOREIGN KEY ("tecnologia_id") REFERENCES "public"."tecnologias"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "proyectos_tecnologias" ADD CONSTRAINT "proyectos_tecnologias_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_imagen_principal_id_media_id_fk" FOREIGN KEY ("imagen_principal_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
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
  
  DO $$ BEGIN
   ALTER TABLE "redes_sociales" ADD CONSTRAINT "redes_sociales_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redes_sociales" ADD CONSTRAINT "redes_sociales_logo_monocromatico_id_media_id_fk" FOREIGN KEY ("logo_monocromatico_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tecnologias" ADD CONSTRAINT "tecnologias_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tecnologias" ADD CONSTRAINT "tecnologias_logo_monocromatico_id_media_id_fk" FOREIGN KEY ("logo_monocromatico_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cargos_fk" FOREIGN KEY ("cargos_id") REFERENCES "public"."cargos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_eventos_fk" FOREIGN KEY ("eventos_id") REFERENCES "public"."eventos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_miembros_fk" FOREIGN KEY ("miembros_id") REFERENCES "public"."miembros"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_proyectos_fk" FOREIGN KEY ("proyectos_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redes_sociales_fk" FOREIGN KEY ("redes_sociales_id") REFERENCES "public"."redes_sociales"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tecnologias_fk" FOREIGN KEY ("tecnologias_id") REFERENCES "public"."tecnologias"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "cargos_updated_at_idx" ON "cargos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "cargos_created_at_idx" ON "cargos" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "eventos_fechas_horas_order_idx" ON "eventos_fechas_horas" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "eventos_fechas_horas_parent_id_idx" ON "eventos_fechas_horas" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "eventos_imagenes_secundarias_order_idx" ON "eventos_imagenes_secundarias" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "eventos_imagenes_secundarias_parent_id_idx" ON "eventos_imagenes_secundarias" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "eventos_imagenes_secundarias_imagen_idx" ON "eventos_imagenes_secundarias" USING btree ("imagen_id");
  CREATE INDEX IF NOT EXISTS "eventos_asistentes_order_idx" ON "eventos_asistentes" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "eventos_asistentes_parent_id_idx" ON "eventos_asistentes" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "eventos_requisitos_order_idx" ON "eventos_requisitos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "eventos_requisitos_parent_id_idx" ON "eventos_requisitos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "eventos_publicaciones_order_idx" ON "eventos_publicaciones" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "eventos_publicaciones_parent_id_idx" ON "eventos_publicaciones" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "eventos_publicaciones_red_social_idx" ON "eventos_publicaciones" USING btree ("red_social_id");
  CREATE INDEX IF NOT EXISTS "eventos_imagen_principal_idx" ON "eventos" USING btree ("imagen_principal_id");
  CREATE INDEX IF NOT EXISTS "eventos_updated_at_idx" ON "eventos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "eventos_created_at_idx" ON "eventos" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "eventos_rels_order_idx" ON "eventos_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "eventos_rels_parent_idx" ON "eventos_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "eventos_rels_path_idx" ON "eventos_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "eventos_rels_miembros_id_idx" ON "eventos_rels" USING btree ("miembros_id");
  CREATE INDEX IF NOT EXISTS "miembros_redes_order_idx" ON "miembros_redes" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "miembros_redes_parent_id_idx" ON "miembros_redes" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "miembros_redes_nombre_idx" ON "miembros_redes" USING btree ("nombre_id");
  CREATE INDEX IF NOT EXISTS "miembros_fotos_secundarias_order_idx" ON "miembros_fotos_secundarias" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "miembros_fotos_secundarias_parent_id_idx" ON "miembros_fotos_secundarias" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "miembros_fotos_secundarias_imagen_idx" ON "miembros_fotos_secundarias" USING btree ("imagen_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "miembros_email_idx" ON "miembros" USING btree ("email");
  CREATE UNIQUE INDEX IF NOT EXISTS "miembros_slug_idx" ON "miembros" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "miembros_foto_idx" ON "miembros" USING btree ("foto_id");
  CREATE INDEX IF NOT EXISTS "miembros_cargo_idx" ON "miembros" USING btree ("cargo_id");
  CREATE INDEX IF NOT EXISTS "miembros_updated_at_idx" ON "miembros" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "miembros_created_at_idx" ON "miembros" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "proyectos_imagenes_secundarias_order_idx" ON "proyectos_imagenes_secundarias" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "proyectos_imagenes_secundarias_parent_id_idx" ON "proyectos_imagenes_secundarias" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "proyectos_imagenes_secundarias_imagen_idx" ON "proyectos_imagenes_secundarias" USING btree ("imagen_id");
  CREATE INDEX IF NOT EXISTS "proyectos_tecnologias_order_idx" ON "proyectos_tecnologias" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "proyectos_tecnologias_parent_id_idx" ON "proyectos_tecnologias" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "proyectos_tecnologias_tecnologia_idx" ON "proyectos_tecnologias" USING btree ("tecnologia_id");
  CREATE INDEX IF NOT EXISTS "proyectos_imagen_principal_idx" ON "proyectos" USING btree ("imagen_principal_id");
  CREATE INDEX IF NOT EXISTS "proyectos_updated_at_idx" ON "proyectos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "proyectos_created_at_idx" ON "proyectos" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "proyectos_rels_order_idx" ON "proyectos_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "proyectos_rels_parent_idx" ON "proyectos_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "proyectos_rels_path_idx" ON "proyectos_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "proyectos_rels_miembros_id_idx" ON "proyectos_rels" USING btree ("miembros_id");
  CREATE INDEX IF NOT EXISTS "redes_sociales_logo_idx" ON "redes_sociales" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "redes_sociales_logo_monocromatico_idx" ON "redes_sociales" USING btree ("logo_monocromatico_id");
  CREATE INDEX IF NOT EXISTS "redes_sociales_updated_at_idx" ON "redes_sociales" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "redes_sociales_created_at_idx" ON "redes_sociales" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "tecnologias_logo_idx" ON "tecnologias" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "tecnologias_logo_monocromatico_idx" ON "tecnologias" USING btree ("logo_monocromatico_id");
  CREATE INDEX IF NOT EXISTS "tecnologias_updated_at_idx" ON "tecnologias" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tecnologias_created_at_idx" ON "tecnologias" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cargos_id_idx" ON "payload_locked_documents_rels" USING btree ("cargos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_eventos_id_idx" ON "payload_locked_documents_rels" USING btree ("eventos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_miembros_id_idx" ON "payload_locked_documents_rels" USING btree ("miembros_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_proyectos_id_idx" ON "payload_locked_documents_rels" USING btree ("proyectos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_redes_sociales_id_idx" ON "payload_locked_documents_rels" USING btree ("redes_sociales_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tecnologias_id_idx" ON "payload_locked_documents_rels" USING btree ("tecnologias_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "cargos" CASCADE;
  DROP TABLE "eventos_fechas_horas" CASCADE;
  DROP TABLE "eventos_imagenes_secundarias" CASCADE;
  DROP TABLE "eventos_asistentes" CASCADE;
  DROP TABLE "eventos_requisitos" CASCADE;
  DROP TABLE "eventos_publicaciones" CASCADE;
  DROP TABLE "eventos" CASCADE;
  DROP TABLE "eventos_rels" CASCADE;
  DROP TABLE "miembros_redes" CASCADE;
  DROP TABLE "miembros_fotos_secundarias" CASCADE;
  DROP TABLE "miembros" CASCADE;
  DROP TABLE "proyectos_imagenes_secundarias" CASCADE;
  DROP TABLE "proyectos_tecnologias" CASCADE;
  DROP TABLE "proyectos" CASCADE;
  DROP TABLE "proyectos_rels" CASCADE;
  DROP TABLE "redes_sociales" CASCADE;
  DROP TABLE "tecnologias" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_proyectos_tipo_sistema";
  DROP TYPE "public"."enum_proyectos_estado";`)
}

// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Cargos } from "./collections/Cargos";
import { Miembros } from "./collections/Miembros";
import { Proyectos } from "./collections/Proyectos";
import { Redes_sociales } from "./collections/Redes_sociales";
import { Tecnologias } from "./collections/Tecnologias";
import { Eventos } from "./collections/Eventos";
import { ProjectRoles } from "./collections/ProjectRoles";
import { Carreras } from "./collections/Carreras";
import { Resumes } from "./collections/Resumes";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  defaultDepth: 1,
  maxDepth: 3,
  collections: [
    Users,
    Media,
    Cargos,
    Eventos,
    Miembros,
    Proyectos,
    ProjectRoles,
    Redes_sociales,
    Tecnologias,
    Carreras,
    Resumes,
  ],
  cors: ["http://localhost:3000", "https://csipro.isi.unison.mx"],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      allowExitOnIdle: false,
      keepAlive: true,
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: +process.env.DB_PORT,
    },
  }),
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});

import path from "path";

import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloud } from "@payloadcms/plugin-cloud";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Media from "./collections/Media/index";
import { Miembros } from "./collections/Miembros/index";
import { Eventos } from "./collections/Eventos/index";
import { Cargos } from "./collections/Cargos";
import { Redes_sociales } from "./collections/Redes_sociales";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [Users, Media, Miembros, Eventos, Cargos, Redes_sociales],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});

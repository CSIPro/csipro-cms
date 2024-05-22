import { CollectionConfig } from "payload/types";

export const Tecnologias: CollectionConfig = {
  slug: "tecnologias",
  admin: {
    useAsTitle: "nombre",
  },
  access: {
    create: () => true,
    read: () => true,
    delete: () => true,
    update: () => true,
  },
  fields: [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true,
    },
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "logo_monocromatico",
      label: "Logo Monocromatico",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
};

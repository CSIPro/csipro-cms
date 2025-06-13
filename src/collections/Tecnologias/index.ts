import { CollectionConfig } from "payload";

export const Tecnologias: CollectionConfig = {
  slug: "tecnologias",
  labels: {
    singular: "Tecnología",
    plural: "Tecnologías",
  },
  admin: {
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "logo", "logo_monocromatico"],
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

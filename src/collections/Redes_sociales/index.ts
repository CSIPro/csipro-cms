import { CollectionConfig } from "payload";

export const Redes_sociales: CollectionConfig = {
  slug: "redes_sociales",
  labels: {
    singular: "Red social",
    plural: "Redes sociales",
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
      relationTo: "media",
      type: "upload",
      required: true,
    },
    {
      name: "logo_monocromatico",
      label: "Logo monocromático",
      relationTo: "media",
      type: "upload",
      required: true,
    },
  ],
};

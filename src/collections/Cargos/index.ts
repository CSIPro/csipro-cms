import { CollectionConfig } from "payload/types";

export const Cargos: CollectionConfig = {
  slug: "cargos",
  admin: {
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "descripcion"],
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
      name: "descripcion",
      label: "Descripción",
      type: "richText",
      required: true,
    },
  ],
};

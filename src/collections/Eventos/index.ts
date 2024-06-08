import { CollectionConfig } from "payload/types";

export const Eventos: CollectionConfig = {
  slug: "eventos",
  labels: {
    singular: "Evento",
    plural: "Eventos",
  },
  admin: {
    useAsTitle: "titulo",
    defaultColumns: ["tipo", "titulo", "fecha", "lugar", "cupos"],
  },
  access: {
    create: () => true,
    read: () => true,
    delete: () => true,
    update: () => true,
  },
  fields: [
    //En el futuro puede ser una relación con la colección de categorias/tipo de evento
    {
      name: "tipo",
      label: "Tipo",
      type: "text",
    },
    {
      name: "titulo",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      name: "fecha",
      label: "Fecha",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "hora",
      label: "Hora",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "timeOnly",
        },
      },
    },
    {
      name: "lugar",
      label: "Lugar",
      type: "text",
    },
    {
      name: "duracion",
      label: "Duración",
      type: "number",
      min: 0,
    },
    {
      name: "participantes",
      label: "Participantes",
      relationTo: "miembros",
      type: "relationship",
      hasMany: true,
    },
    {
      name: "cupos",
      label: "Número de lugares disponibles",
      type: "number",
      min: 0,
    },
    {
      name: "imagen_principal",
      label: "Imagen Principal",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "imagenes_secundarias",
      label: "Imagenes Secundarias",
      type: "array",
      fields: [
        {
          name: "imagen",
          label: "Imagen",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};

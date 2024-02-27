import { CollectionConfig } from "payload/types";

export const Eventos: CollectionConfig = {
  slug: "eventos",
  admin: {
    useAsTitle: "titulo",
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
      name: "imagen",
      label: "Imagen",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
};

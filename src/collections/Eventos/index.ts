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
      name: "fecha_inicio",
      label: "Fecha de inicio",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",

          timeFormat: "HH:mm",
        },
      },
    },
    {
      name: "fecha_fin",
      label: "Fecha fin",
      type: "date",
      admin: {
        description:
          "Ultima fecha de un evento que dura varios días. Deberá de ser la misma que la ultima fecha de la lista de fechas y horas.",
        date: {
          pickerAppearance: "dayAndTime",

          timeFormat: "HH:mm",
        },
      },
    },
    {
      name: "fechas_horas",
      label: "Fechas y Horas",
      type: "array",
      required: true,
      labels: {
        singular: "Fecha y Hora",
        plural: "Fechas y Horas",
      },
      fields: [
        {
          name: "fecha_hora",
          label: "Fecha y Hora",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayAndTime",

              timeFormat: "HH:mm",
            },
          },
        },
      ],
    },
    {
      name: "lugar",
      label: "Lugar",
      type: "text",
      required: true,
    },
    {
      name: "duracion",
      label: "Duración (en horas)",
      type: "number",
      min: 0,
      required: true,
    },
    {
      name: "participantes",
      label: "Participantes",
      relationTo: "miembros",
      type: "relationship",
      hasMany: true,
      required: true,
    },
    {
      name: "cupos",
      label: "Número de lugares disponibles",
      type: "number",
      required: true,
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
    {
      name: "descripcion",
      label: "Descripción",
      type: "richText",
    },
    {
      name: "asistentes",
      label: "Asistentes",
      type: "array",
      fields: [
        {
          name: "nombre",
          label: "Nombre(s)",
          type: "text",
          required: true,
        },
        {
          name: "apellido",
          label: "Apellido(s)",
          type: "text",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
        },
        {
          name: "expediente",
          label: "Expediente",
          type: "text",
        },
      ],
    },
    {
      name: "requisitos",
      label: "Requisitos",
      type: "array",
      fields: [
        {
          name: "nombre_requisito",
          label: "Nombre del requisito",
          type: "richText",
          required: true,
        },
        {
          name: "detalles",
          label: "Detalles",
          type: "richText",
        },
      ],
    },
    {
      name: "publicaciones",
      label: "Publicaciones",
      type: "array",
      fields: [
        {
          name: "titulo_publicacion",
          label: "Título de la publicación",
          type: "text",
          required: true,
        },
        {
          name: "red_social",
          label: "Red Social",
          type: "relationship",
          relationTo: "redes_sociales",
          required: true,
        },
        {
          name: "link",
          label: "Link a publicación",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};

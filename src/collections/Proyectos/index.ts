import { CollectionConfig } from "payload/types";

export const Proyectos: CollectionConfig = {
  slug: "proyectos",
  labels: {
    singular: "Proyecto",
    plural: "Proyectos",
  },
  admin: {
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "tipo_sistema", "estado"],
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
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true,
    },
    {
      name: "participantes",
      label: "Participantes",
      relationTo: "miembros",
      type: "relationship",
      hasMany: true,
    },
    {
      name: "tipo_sistema",
      label: "Tipo de sistema",
      type: "select",
      options: [
        "Aplicación Movil",
        "Aplicación de Escritorio",
        "Aplicación Web",
      ],
      required: true,
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "richText",
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
      name: "tecnologias",
      label: "Tecnologias",
      type: "array",
      fields: [
        {
          name: "tecnologia",
          label: "Nombre de la tecnologia",
          relationTo: "tecnologias",
          type: "relationship",
        },
      ],
    },
    {
      name: "fecha_incio",
      label: "Fecha de inicio del proyecto",
      type: "date",
    },
    {
      name: "fecha_termino",
      label: "Fecha de termino del proyecto",
      type: "date",
    },
    {
      name: "estado",
      label: "Estado del proyecto",
      type: "select",
      options: ["Activo", "Inactivo", "Finalizado"],
      required: true,
    },
    {
      name: "url",
      label: "URL",
      type: "text",
    },
    {
      name: "github_url",
      label: "GitHub URL",
      type: "text",
    },
    {
      name: "color",
      label: "Color",
      type: "text",
    },
  ],
};

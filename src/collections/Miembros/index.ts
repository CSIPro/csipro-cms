import { CollectionConfig } from "payload";

export const Miembros: CollectionConfig = {
  slug: "miembros",
  labels: {
    singular: "Miembro",
    plural: "Miembros",
  },
  admin: {
    useAsTitle: "nombres",
    defaultColumns: ["nombres", "apellidos", "email", "cargo"],
  },
  access: {
    create: () => true,
    read: () => true,
    delete: () => true,
    update: () => true,
  },
  fields: [
    {
      name: "nombres",
      label: "Nombres",
      type: "text",
      required: true,
    },
    {
      name: "apellidos",
      label: "Apellidos",
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
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          "El slug es una versión amigable del nombre, generalmente en minúsculas y sin espacios. Se utiliza en las URLs para identificar de manera única a un miembro. Ejemplo: juan-perez",
      },
    },
    {
      name: "redes", // required
      type: "array", // required
      label: "Redes Sociales",
      labels: {
        singular: "Red Social",
        plural: "Redes Sociales",
      },
      fields: [
        // required
        {
          name: "nombre",
          label: "Nombre de Red Social",
          relationTo: "redes_sociales",
          type: "relationship",
        },

        {
          name: "link",
          label: "Link a Red Social",
          type: "text",
        },
      ],
    },
    {
      name: "fecha_entrada",
      label: "Fecha de ingreso a CSI PRO",
      type: "date",
    },
    {
      name: "fecha_salida",
      label: "Fecha de salida a CSI PRO",
      type: "date",
    },
    {
      name: "foto",
      label: "Foto",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "fotos-secundarias",
      label: "Galería",
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
    //En un futuro hacer relación a colección de cargos
    {
      name: "cargo",
      label: "Cargo",
      relationTo: "cargos",
      type: "relationship",
      required: true,
    },
    {
      name: "proyectos",
      type: "join",
      collection: "proyectos",
      on: "participantes",
    },
  ],
};

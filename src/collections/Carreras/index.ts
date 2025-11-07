import { CollectionConfig } from "payload";

export const Carreras: CollectionConfig = {
  slug: "carreras",
  labels: {
    singular: "Carrera",
    plural: "Carreras",
  },
  admin: {
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "slug"],
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
      name: "codigo",
      label: "Código",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "Código único de la carrera, por ejemplo: ISI, IME, IIS.",
      },
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          "El slug es una versión amigable del nombre, generalmente en minúsculas y sin espacios. Se utiliza en las URLs para identificar de manera única a una carrera. Ejemplo: isi, ingenieria-en-sistemas-de-informacion",
      },
      validate: (value: string) => {
        if (!value) {
          return "El slug es obligatorio.";
        }

        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(value)) {
          return "El slug solo puede contener letras minúsculas, números y guiones.";
        }

        return true;
      },
    },
  ],
};

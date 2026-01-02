import { revalidateFrontendCache } from "@/hooks/cache-revalidation";
import { CollectionConfig } from "payload";

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
      type: "array",
      fields: [
        {
          name: "miembro",
          label: "Miembro",
          relationTo: "miembros",
          type: "relationship",
          required: true,
        },
        {
          name: "roles",
          label: "Roles",
          type: "array",
          fields: [
            {
              name: "rol",
              label: "Rol",
              type: "relationship",
              relationTo: "project-roles",
              required: true,
            },
          ],
        },
        {
          name: "descripcion",
          label: "Descripción de participación",
          type: "textarea",
        },
      ],
    },
    {
      name: "tipo_sistema",
      label: "Tipo de sistema",
      type: "select",
      options: ["Aplicación Móvil", "Aplicación de Escritorio", "Aplicación Web"],
      required: true,
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
          "El slug es una versión amigable del nombre, generalmente en minúsculas y sin espacios. Se utiliza en las URLs para identificar de manera única a un proyecto. Ejemplo: csipro-access",
      },
      validate: (value) => {
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
    {
      name: "descripcion",
      label: "Descripción",
      type: "richText",
    },
    {
      name: "subtitulo",
      label: "Subtítulo",
      type: "text",
      maxLength: 100,
      required: true,
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
      name: "fecha_inicio",
      label: "Fecha de inicio del proyecto",
      type: "date",
      required: true,
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
  ],
  hooks: {
    afterChange: [revalidateFrontendCache],
  },
  endpoints: [
    {
      path: "/count",
      method: "get",
      handler: async (req) => {
        try {
          const activeProjects = await req.payload.count({
            collection: "proyectos",
            where: {
              estado: {
                equals: "Activo",
              },
            },
          });

          const inactiveProjects = await req.payload.count({
            collection: "proyectos",
            where: {
              estado: {
                equals: "Inactivo",
              },
            },
          });

          const finishedProjects = await req.payload.count({
            collection: "proyectos",
            where: {
              estado: {
                equals: "Finalizado",
              },
            },
          });

          return Response.json({
            active: activeProjects.totalDocs,
            inactive: inactiveProjects.totalDocs,
            finished: finishedProjects.totalDocs,
          });
        } catch (error) {
          console.error("Error al obtener el conteo de proyectos:", error);

          return Response.json(
            { error: "Error al obtener el conteo de proyectos." },
            { status: 500 },
          );
        }
      },
    },
  ],
};

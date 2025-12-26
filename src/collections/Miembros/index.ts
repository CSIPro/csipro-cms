import { CollectionConfig } from "payload";

export const Miembros: CollectionConfig = {
  slug: "miembros",
  labels: {
    singular: "Miembro",
    plural: "Miembros",
  },
  admin: {
    useAsTitle: "nombres",
    defaultColumns: ["nombres", "apellidos", "slug", "email", "cargo"],
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
      name: "short_name",
      label: "Nombre corto",
      type: "text",
      admin: {
        description:
          "Nombre corto o apodo que se utilizará en lugar del nombre completo en ciertas secciones del sitio web.",
      },
      required: true,
    },
    {
      name: "subtitle",
      label: "Subtítulo",
      type: "text",
      admin: {
        description:
          "Un breve texto que aparecerá debajo del nombre del miembro. Puede ser el puesto preferido o una frase corta.",
      },
      required: true,
    },
    {
      name: "fecha_nacimiento",
      label: "Fecha de Nacimiento",
      type: "date",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "portfolio",
      label: "Portafolio",
      type: "text",
      unique: true,
      admin: {
        description: "Link a portafolio personal o página web.",
      },
      validate: (value) => {
        if (value) {
          try {
            new URL(value);
            return true;
          } catch {
            return "Por favor, ingresa una URL válida.";
          }
        }

        return true;
      },
    },
    {
      name: "resume",
      label: "Currículum",
      type: "upload",
      relationTo: "resumes",
      filterOptions: {
        mimeType: { contains: "pdf" },
      },
      admin: {
        description: "Sube el currículum vitae del miembro.",
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
          "El slug es una versión amigable del nombre, generalmente en minúsculas y sin espacios. Se utiliza en las URLs para identificar de manera única a un miembro. Ejemplo: juan-perez",
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
      name: "sobre_mi",
      label: "Sobre mí",
      type: "richText",
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        {
          label: "Activo",
          value: "activo",
        },
        {
          label: "Egresado",
          value: "egresado",
        },
        {
          label: "Inactivo",
          value: "inactivo",
        },
      ],
      defaultValue: "activo",
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
        {
          name: "red",
          label: "Red Social",
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
    {
      name: "cargo",
      label: "Cargo",
      relationTo: "cargos",
      type: "relationship",
      required: true,
    },
    {
      name: "carrera",
      label: "Carrera",
      relationTo: "carreras",
      type: "relationship",
    },
    {
      name: "proyectos",
      type: "join",
      collection: "proyectos",
      on: "participantes.miembro",
    },
    {
      name: "eventos",
      type: "join",
      collection: "eventos",
      on: "participantes",
    },
    {
      name: "tecnologias",
      label: "Tecnologías preferidas",
      type: "relationship",
      relationTo: "tecnologias",
      hasMany: true,
    },
    {
      name: "intereses",
      label: "Intereses personales",
      labels: {
        singular: "Interés personal",
        plural: "Intereses personales",
      },
      type: "array",
      fields: [
        {
          name: "interes",
          label: "Interés",
          type: "text",
        },
      ],
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        if (!doc || !doc.id) return doc;
        const proyectosCollection = req.payload.collections["proyectos"];
        if (!proyectosCollection) return doc;
        const result = await req.payload.count({
          collection: "proyectos",
          where: {
            // Why, Payload?
            "participantes.miembro": {
              equals: doc.id,
            },
          },
        });
        if (typeof doc.proyectos === "object" && doc.proyectos !== null) {
          doc.proyectos.totalDocs = result.totalDocs;
        } else {
          doc.proyectos = { docs: [], hasNextPage: false, totalDocs: result.totalDocs };
        }
        for (const proyecto of doc.proyectos.docs ?? []) {
          const participant = (proyecto.participantes ?? []).find((p) => p.miembro === doc.id); // Find the participant object for this member
          if (!participant) continue;
          const participantRoles = [];
          for (const role of participant.roles as { id: string; rol: number }[]) {
            const participantRole = await req.payload.findByID({
              collection: "project-roles",
              id: role.rol,
            });
            if (!participantRole) continue;
            participantRoles.push(participantRole.role);
          }
          participant.roles = participantRoles; // Replace role IDs with role names
        }
        const eventosCollection = req.payload.collections["eventos"];
        if (!eventosCollection) return doc;
        const eventosResult = await req.payload.count({
          collection: "eventos",
          where: {
            participantes: {
              contains: doc.id,
            },
          },
        });
        if (typeof doc.eventos === "object" && doc.eventos !== null) {
          doc.eventos.totalDocs = eventosResult.totalDocs;
        } else {
          doc.eventos = { docs: [], hasNextPage: false, totalDocs: eventosResult.totalDocs };
        }
        return doc;
      },
    ],
  },
  endpoints: [
    {
      path: "/:id/events",
      method: "get",
      handler: async (req) => {
        const memberId = req.routeParams.id;
        const { limit, page } = req.query;

        const memberEvents = await req.payload.find({
          collection: "eventos",
          where: {
            participantes: {
              contains: memberId,
            },
          },
          sort: "-fecha_inicio",
          limit: limit ? Number(limit) : 10,
          page: page ? Number(page) : 1,
        });

        console.log(memberEvents);

        return Response.json(memberEvents);
      },
    },
    {
      path: "/:id/projects",
      method: "get",
      handler: async (req) => {
        const memberId = req.routeParams.id;
        const { limit, page } = req.query;

        const memberProjects = await req.payload.find({
          collection: "proyectos",
          where: {
            "participantes.miembro": {
              equals: +memberId,
            },
          },
          sort: "-fecha_inicio",
          limit: limit ? Number(limit) : 10,
          page: page ? Number(page) : 1,
        });

        console.log(memberProjects);

        return Response.json(memberProjects);
      },
    },
  ],
};

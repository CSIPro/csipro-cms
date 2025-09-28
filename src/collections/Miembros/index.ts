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
      name: "proyectos",
      type: "join",
      collection: "proyectos",
      on: "participantes.miembro",
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

          const participantRole = await req.payload.findByID({
            collection: "project-roles",
            id: participant.rol,
          });

          if (!participantRole) continue;

          participant.rol = participantRole.role; // Replace role ID with role name
        }

        return doc;
      },
    ],
  },
};

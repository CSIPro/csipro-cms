import { CollectionConfig } from "payload";

export const ProjectRoles: CollectionConfig = {
  slug: "project-roles",
  labels: {
    singular: "Rol de proyecto",
    plural: "Roles de proyecto",
  },
  admin: {
    useAsTitle: "role",
  },
  access: {
    create: () => true,
    read: () => true,
    delete: () => true,
    update: () => true,
  },
  fields: [
    {
      name: "role",
      label: "Rol",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descripción del rol",
      type: "textarea",
    },
    {
      name: "projects",
      label: "Proyectos asociados",
      type: "join",
      collection: "proyectos",
      on: "participantes.roles.rol",
    },
  ],
};

import { CollectionConfig } from "payload";

export const Resumes: CollectionConfig = {
  slug: "resumes",
  upload: true,
  access: {
    create: () => true,
    read: () => true,
    delete: () => true,
    update: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};

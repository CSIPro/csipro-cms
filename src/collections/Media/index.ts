import path from "path";
import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  access: {
    create: () => true,
    read: () => true,
    delete: () => true,
    update: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};

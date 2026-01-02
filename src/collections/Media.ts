import { CollectionConfig } from "payload";
import { generateImageSizes } from "./Media/generate-image-sizes";
import { cleanupEmptyImage } from "./Media/cleanup-empty-image";
import { revalidateMediaRelationsCache } from "@/hooks/cache-revalidation";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    disableLocalStorage: false,
    imageSizes: [],
    mimeTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/tiff",
      "image/svg+xml",
    ],
    formatOptions: {
      format: "webp",
    },
  },
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
    {
      name: "sizes",
      type: "group",
      fields: [
        {
          name: "thumbnail",
          type: "group",
          fields: [
            { name: "url", type: "text" },
            { name: "width", type: "number" },
            { name: "height", type: "number" },
            { name: "mimeType", type: "text" },
            { name: "filesize", type: "number" },
            { name: "filename", type: "text" },
          ],
        },
        {
          name: "small",
          type: "group",
          fields: [
            { name: "url", type: "text" },
            { name: "width", type: "number" },
            { name: "height", type: "number" },
            { name: "mimeType", type: "text" },
            { name: "filesize", type: "number" },
            { name: "filename", type: "text" },
          ],
        },
        {
          name: "medium",
          type: "group",
          fields: [
            { name: "url", type: "text" },
            { name: "width", type: "number" },
            { name: "height", type: "number" },
            { name: "mimeType", type: "text" },
            { name: "filesize", type: "number" },
            { name: "filename", type: "text" },
          ],
        },
        {
          name: "large",
          type: "group",
          fields: [
            { name: "url", type: "text" },
            { name: "width", type: "number" },
            { name: "height", type: "number" },
            { name: "mimeType", type: "text" },
            { name: "filesize", type: "number" },
            { name: "filename", type: "text" },
          ],
        },
        {
          name: "hero",
          type: "group",
          fields: [
            { name: "url", type: "text" },
            { name: "width", type: "number" },
            { name: "height", type: "number" },
            { name: "mimeType", type: "text" },
            { name: "filesize", type: "number" },
            { name: "filename", type: "text" },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [generateImageSizes],
    afterChange: [cleanupEmptyImage, revalidateMediaRelationsCache],
  },
};

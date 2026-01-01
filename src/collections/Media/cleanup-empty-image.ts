import { CollectionAfterChangeHook } from "payload";
import fs from "fs/promises";
import path from "path";

export const cleanupEmptyImage: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation !== "create" && operation !== "update") {
    return doc;
  }

  const file = req.file;
  if (!file) return doc;

  try {
    const uploadDir = path.join(process.cwd(), "media");

    // Check if the original file exists and is empty
    const originalFilePath = path.join(uploadDir, file.name);

    try {
      const stats = await fs.stat(originalFilePath);

      // If file exists and is empty (0 bytes), delete it
      if (stats.size === 0) {
        await fs.unlink(originalFilePath);
        req.payload.logger.info(`Deleted empty file: ${file.name}`);
      }
    } catch (error) {
      // File doesn't exist, which is fine
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        req.payload.logger.error(`Error checking file: ${error}`);
      }
    }
  } catch (error) {
    req.payload.logger.error(`Error in cleanup hook: ${error}`);
  }

  return doc;
};

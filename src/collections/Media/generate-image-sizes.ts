import { exec } from "child_process";
import { CollectionBeforeChangeHook, PayloadRequest } from "payload";
import { promisify } from "util";
import os from "os";
import path from "path";
import fs from "fs/promises";
import { imageSizeFromFile } from "image-size/fromFile";

const execAsync = promisify(exec);

interface ImageSize {
  name: string;
  width: number;
  quality?: number;
}

const IMAGE_SIZES: ImageSize[] = [
  { name: "thumbnail", width: 400, quality: 75 },
  { name: "small", width: 800, quality: 80 },
  { name: "medium", width: 1200, quality: 80 },
  { name: "large", width: 1600, quality: 85 },
  { name: "hero", width: 1920, quality: 90 },
];

export const generateImageSizes: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation !== "create" && operation !== "update") {
    return data;
  }

  const file = req.file;
  if (!file) return data;

  const supportedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/tiff"];
  if (!supportedMimes.includes(file.mimetype)) {
    const uploadedSvg = await uploadSvgFile(file, data);

    if (uploadedSvg) {
      const svgData = await fs.readFile(uploadedSvg.outputPath);

      req.file.data = svgData;

      return uploadedSvg.data;
    }

    return data;
  }

  try {
    const tempDir = os.tmpdir();

    let inputPath: string;
    let shouldCleanupInput = false;

    if (file.tempFilePath) {
      inputPath = file.tempFilePath;
    } else if (file.data) {
      const tempInputFileName = `${Date.now()}-${file.name}`;
      inputPath = path.join(tempDir, tempInputFileName);
      await fs.writeFile(inputPath, file.data);
      shouldCleanupInput = true;
    } else {
      req.payload.logger.error("No valid file data found for image processing.");
      return data;
    }

    const uploadDir = path.join(process.cwd(), "media");
    await fs.mkdir(uploadDir, { recursive: true });

    const sizes: Record<string, any> = {};
    const baseName = path.parse(file.name).name;

    // Convert original image to WebP without resizing
    const originalFileName = `${baseName}.webp`;
    const tempOriginalPath = path.join(tempDir, originalFileName);
    const finalOriginalPath = path.join(uploadDir, originalFileName);

    await execAsync(`cwebp -q 90 "${inputPath}" -o "${tempOriginalPath}"`);
    await fs.copyFile(tempOriginalPath, finalOriginalPath);

    const originalStats = await fs.stat(finalOriginalPath);
    const originalDimensions = await imageSizeFromFile(finalOriginalPath);

    await fs.unlink(tempOriginalPath).catch(() => {});

    // Generate size variants
    for (const size of IMAGE_SIZES) {
      const outputFileName = `${baseName}-${size.name}.webp`;
      const tempOutputPath = path.join(tempDir, outputFileName);
      const finalOutputPath = path.join(uploadDir, outputFileName);

      await execAsync(
        `cwebp -q ${size.quality ?? 75} -resize ${size.width} 0 "${inputPath}" -o "${tempOutputPath}"`,
      );

      await fs.copyFile(tempOutputPath, finalOutputPath);

      const stats = await fs.stat(finalOutputPath);
      const dimensions = await imageSizeFromFile(finalOutputPath);

      sizes[size.name] = {
        filename: outputFileName,
        mimeType: "image/webp",
        url: `/api/media/file/${outputFileName}`,
        filesize: stats.size,
        height: dimensions.height,
        width: dimensions.width,
      };

      await fs.unlink(tempOutputPath).catch(() => {});
    }

    if (shouldCleanupInput) {
      await fs.unlink(inputPath).catch(() => {});
    }

    // Update the main file data with the original WebP conversion
    return {
      ...data,
      filename: originalFileName,
      mimeType: "image/webp",
      filesize: originalStats.size,
      url: `/api/media/file/${originalFileName}`,
      width: originalDimensions.width,
      height: originalDimensions.height,
      thumbnailURL: sizes.thumbnail?.url,
      sizes,
    };
  } catch (error) {
    req.payload.logger.error(`Error generating image sizes: ${error}`);
    return data;
  }
};

const uploadSvgFile = async (file: PayloadRequest["file"], data: Partial<any>) => {
  if (!file) return null;

  const uploadDir = path.join(process.cwd(), "media");
  await fs.mkdir(uploadDir, { recursive: true });

  const baseName = path.parse(file.name).name;
  const outputFileName = `${baseName}-svg.svg`;
  const finalOutputPath = path.join(uploadDir, outputFileName);

  if (file.tempFilePath) {
    await fs.copyFile(file.tempFilePath, finalOutputPath);
  } else if (file.data.length > 0) {
    await fs.writeFile(finalOutputPath, file.data);
  } else {
    return null;
  }

  const stats = await fs.stat(finalOutputPath);

  return {
    data: {
      ...data,
      filename: outputFileName,
      mimeType: "image/svg+xml",
      url: `/api/media/file/${outputFileName}`,
      filesize: stats.size,
    },
    outputPath: finalOutputPath,
  };
};

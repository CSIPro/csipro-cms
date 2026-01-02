import { CollectionAfterChangeHook, CollectionSlug } from "payload";

const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN || "";
const REVALIDATION_ENDPOINT = process.env.REVALIDATION_ENDPOINT || "";

interface Path {
  mainPath: string;
  itemPath: string;
  revalidateIndex?: boolean;
}

const frontendPaths: Partial<Record<CollectionSlug, Path>> = {
  miembros: { mainPath: "/nosotros", itemPath: "/miembros", revalidateIndex: true },
  eventos: { mainPath: "/eventos", itemPath: "/eventos", revalidateIndex: true },
  proyectos: { mainPath: "/proyectos", itemPath: "/proyectos", revalidateIndex: true },
};

async function triggerRevalidation(pathsToRevalidate: string[], req: any) {
  if (!REVALIDATION_ENDPOINT || !REVALIDATION_TOKEN) {
    req.payload.logger.warn("Revalidation endpoint or token not set. Skipping cache revalidation.");
    return;
  }

  if (pathsToRevalidate.length === 0) return;

  try {
    const res = await fetch(REVALIDATION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paths: pathsToRevalidate, secret: REVALIDATION_TOKEN }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      req.payload.logger.error(
        `Failed to revalidate cache for paths '${pathsToRevalidate}'. Status: ${res.status}. Response: ${errorText}`,
      );
      return;
    }

    req.payload.logger.info(
      `Successfully triggered cache revalidation for paths: ${pathsToRevalidate.join(", ")}`,
    );
  } catch (error) {
    req.payload.logger.error(
      `Error during cache revalidation for path '${pathsToRevalidate}': ${(error as Error).message}`,
    );
  }
}

export const revalidateFrontendCache: CollectionAfterChangeHook = async ({
  collection,
  data,
  req,
}) => {
  const collectionPaths = frontendPaths[collection.slug];

  if (!collectionPaths) {
    req.payload.logger.info(
      `No frontend path mapped for collection '${collection.slug}'. Skipping cache revalidation.`,
    );
    return;
  }

  const itemSlug = data?.slug;
  if (!itemSlug) {
    req.payload.logger.warn(`No item ID found in data for collection '${collection.slug}'..`);
  }

  const pathsToRevalidate = [
    collectionPaths.mainPath,
    ...(itemSlug ? [`${collectionPaths.itemPath}/${itemSlug}`] : []),
    ...(collectionPaths.revalidateIndex ? ["/"] : []),
  ];

  await triggerRevalidation(pathsToRevalidate, req);
};

export const revalidateMediaRelationsCache: CollectionAfterChangeHook = async ({ doc, req }) => {
  const mediaId = (doc as any)?.id;
  if (!mediaId) return;

  const paths = new Set<string>();

  // Miembros: foto + galería
  // Field names from [src/collections/Miembros/index.ts](src/collections/Miembros/index.ts)
  const miembrosResult = await req.payload.find({
    collection: "miembros",
    where: {
      or: [{ foto: { equals: mediaId } }, { "fotos-secundarias.imagen": { equals: mediaId } }],
    },
    limit: 1000,
  });

  if (miembrosResult.docs.length > 0) {
    paths.add("/nosotros");
    for (const miembro of miembrosResult.docs) {
      paths.add(`/miembros/${miembro.slug}`);
    }
  }

  // Eventos: imagen_principal + imagenes_secundarias
  // Field names from [src/collections/Eventos/index.ts](src/collections/Eventos/index.ts)
  const eventosResult = await req.payload.find({
    collection: "eventos",
    where: {
      or: [
        { imagen_principal: { equals: mediaId } },
        { "imagenes_secundarias.imagen": { equals: mediaId } },
      ],
    },
    limit: 1000,
  });

  if (eventosResult.docs.length > 0) {
    paths.add("/eventos");
    for (const evento of eventosResult.docs) {
      paths.add(`/eventos/${evento.slug}`);
    }
  }

  // Proyectos: assumes same pattern as eventos (adjust field names if needed)
  const proyectosResult = await req.payload.find({
    collection: "proyectos",
    where: {
      or: [
        { imagen_principal: { equals: mediaId } },
        { "imagenes_secundarias.imagen": { equals: mediaId } },
      ],
    },
    limit: 1000,
  });

  if (proyectosResult.docs.length > 0) {
    paths.add("/proyectos");
    for (const proyecto of proyectosResult.docs) {
      paths.add(`/proyectos/${proyecto.slug}`);
    }
  }

  await triggerRevalidation([...paths], req);
};

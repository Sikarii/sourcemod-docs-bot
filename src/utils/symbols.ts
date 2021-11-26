import fs from "fs";
import path from "path";

import { fetchAsJson, readFileAsJson, removeIfExists } from "./index";

import {
  MANIFEST_DIRECTORY,
  MANIFEST_FILE_PATH,
  MANIFEST_REMOTE_URL,
} from "../constants";

import { DocSymbol, ManifestIncludes } from "../types/DocSymbol";

export const getSymbolDisplay = (s: DocSymbol) => {
  return `${s.include} :: ${s.realTag} :: ${s.name}`;
};

export const getSymbolFullName = (s: DocSymbol) => {
  return `${s.include}/${s.realTag}/${s.name}`;
};

export const getSymbolsForQuery = (query: string, allSymbols: DocSymbol[]) => {
  const lowerQuery = query.toLowerCase();

  // Interactions are limited to 25 results
  const results = allSymbols
    .filter((s) => getSymbolFullName(s).toLowerCase().includes(lowerQuery))
    .slice(0, 25);

  return results;
};

export const fetchManifest = async (forceRecreate: boolean): Promise<ManifestIncludes> => {
  const remoteManifest = await fetchAsJson(MANIFEST_REMOTE_URL);
  if (!remoteManifest) {
    throw new Error("Failed to fetch manifest");
  }

  const localManifest = await readFileAsJson(MANIFEST_FILE_PATH);

  const shouldRecreate = forceRecreate || !localManifest || localManifest.timestamp < remoteManifest.timestamp;

  if (shouldRecreate) {
    await removeIfExists(MANIFEST_DIRECTORY);
    await fs.promises.mkdir(MANIFEST_DIRECTORY, { recursive: true });

    await fs.promises.writeFile(MANIFEST_FILE_PATH, JSON.stringify(remoteManifest));

    for (const include in remoteManifest.includes) {
      const includeUrl = remoteManifest.includes[include];
      const includeName = path.basename(include);

      const includeJson = await fetchAsJson(includeUrl);
      const includePath = path.join(MANIFEST_DIRECTORY, `${includeName}.gid`);
  
      await fs.promises.writeFile(includePath, JSON.stringify(includeJson));
    }
  }

  const manifest = !shouldRecreate ? localManifest : remoteManifest;

  for (const include in manifest.includes) {
    const includeName = path.basename(include);
    const includePath = path.join(MANIFEST_DIRECTORY, `${includeName}.gid`);

    manifest.includes[include] = await readFileAsJson(includePath);
  }

  return manifest.includes as ManifestIncludes;
};
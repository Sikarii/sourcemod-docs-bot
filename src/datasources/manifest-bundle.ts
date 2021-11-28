import axios from "axios";

import { Symbol } from "../types/sp-gid-typings/types";

import { MANIFEST_REMOTE_BASE_URL } from "../constants";

interface VersionDetail {
  hash: string;
  time: number;
  count: number;
};

export type ManifestBundleSectionKey =
  | "constants"
  | "defines"
  | "enums"
  | "functions"
  | "methodmaps"
  | "enumstructs"
  | "typedefs"
  | "typesets";

export interface ManifestBundle {
  meta: ManifestBundleMeta;
  source: ManifestBundleSource;
  strands: ManifestBundleStrands;
  version: VersionDetail;
};

export interface ManifestBundleMeta {
  name: string;
  author: string;
  description: string;
};

// Fix type, merge and endpoints types
export interface ManifestBundleSource {
  type: "git";
  merge: null;
  repository: string;
  endpoints: null;
  patterns: string[];
};

export interface ManifestBundleSymbolDefinition {
  symbol: Symbol;
  created: VersionDetail;
  last_updated: VersionDetail;
};

export type ManifestBundleStrands = Record<string, ManifestBundleStrand>;
export type ManifestBundleStrand = Record<ManifestBundleSectionKey, ManifestBundleSection>;
export type ManifestBundleSection = Record<string, ManifestBundleSymbolDefinition>;

export const fetchManifestBundle = async (name: string): Promise<ManifestBundle> => {
  const bundleUrl = `${MANIFEST_REMOTE_BASE_URL}/${name}.bundle`;

  const response = await axios.get(bundleUrl);
  return response.data;
};

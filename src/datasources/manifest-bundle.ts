import axios from "axios";

import { Symbol } from "../types/sp-gid-typings/types";

import { MANIFEST_REMOTE_BASE_URL } from "../constants";

interface VersionDetail {
  hash: string;
  time: number;
  count: number;
};

export type ManifestSectionKey =
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
export type ManifestBundleStrand = Record<ManifestSectionKey, ManifestBundleSymbolSection>;
export type ManifestBundleSymbolSection = Record<string, ManifestBundleSymbolDefinition>;

export const fetchManifestBundle = async (name: string): Promise<ManifestBundle> => {
  const bundleUrl = `${MANIFEST_REMOTE_BASE_URL}/${name}.bundle`;

  const response = await axios.get(bundleUrl);
  return response.data;
};
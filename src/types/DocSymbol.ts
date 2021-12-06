import { Symbol, Identifier } from "./sp-gid-typings";
import { ManifestBundleSectionKey } from "../datasources/manifest-bundle";

export type DocSymbol = Symbol & {
  include: string;
  identifier: Identifier;
};

export const SINGLETON_SECTIONS = {
  "constants": Identifier.Constant,
  "defines": Identifier.Define,
  "enums": Identifier.Enumeration,
  "functions": Identifier.Function,
  "methodmaps": Identifier.MethodMap,
  "enumstructs": Identifier.EnumStruct,
  "typedefs": Identifier.TypeDefinition,
  "typesets": Identifier.TypeSet,
} as const;

export type SingletonIdentifier = typeof SINGLETON_SECTIONS[ManifestBundleSectionKey];

export const isValidSection = (key: string): key is ManifestBundleSectionKey => {
  return SINGLETON_SECTIONS[key as ManifestBundleSectionKey] !== undefined;
};

export const sectionKeyToTag = (key: ManifestBundleSectionKey): SingletonIdentifier => {
  return SINGLETON_SECTIONS[key];
};

export const nestedToSingleton = (key: Identifier): SingletonIdentifier => {
  const mapping = {
    [Identifier.EnumStructField]: Identifier.Field,
    [Identifier.EnumStructMethod]: Identifier.Function,
    [Identifier.MethodMapMethod]: Identifier.Function,
    [Identifier.MethodMapProperty]: Identifier.Property,
  };

  // TODO: Quite hacky
  return (mapping as any)[key] ?? key;
};

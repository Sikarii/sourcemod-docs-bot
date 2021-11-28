import { Symbol, Identifier } from "./sp-gid-typings";

export type IncludeSection = Record<SectionKey, DocSymbol[]>;
export type ManifestIncludes = Record<string, IncludeSection>;

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

export type SectionKey = keyof typeof SINGLETON_SECTIONS;
export type SingletonIdentifier = typeof SINGLETON_SECTIONS[SectionKey];

export const sectionKeyToTag = (key: string): SingletonIdentifier | undefined => {
  return SINGLETON_SECTIONS[key as any as SectionKey];
};

export const nestedToSingleton = (key: Identifier): SingletonIdentifier | undefined => {
  const mapping = {
    [Identifier.EnumStructField]: Identifier.Field,
    [Identifier.EnumStructMethod]: Identifier.Function,
    [Identifier.MethodMapMethod]: Identifier.Function,
    [Identifier.MethodMapProperty]: Identifier.Property,
  };

  // TODO: Quite hacky
  return (mapping as any)[key];
};

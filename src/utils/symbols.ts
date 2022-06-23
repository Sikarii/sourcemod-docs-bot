// Some of the sourcemod-dev schema types conflict, i.e. Function
/* eslint @typescript-eslint/ban-types: off */

import {
  Part,
  IType,
  Entry,
  TypeSet,
  Function,
  MethodMap,
  Identifier,
  Enumeration,
  TypeDefinition,
  ClassSymbol,
  splitPath,
  normalizeIdentifier,
} from "@sourcemod-dev/schema";

import {
  AM_DOCS_URL,
  SM_DEV_DOCS_URL,
  MAX_ENUM_MEMBERS,
  MAX_TYPESET_DEFS,
  MAX_METHODMAP_METHODS,
  MAX_METHODMAP_PROPERTIES,
  MAX_FUNCTION_ARGS_INLINE,
} from "../constants";

import { buildCode, buildCodeBlock } from "./index";

import symbolsManager from "../managers/symbols";

export const getSymbolPath = (path: string[]) => {
  return path.slice(0, 3).join("/");
};

export const getSymbolName = (path: string[]) => {
  const segments = path.slice(1, 3).map((p) => {
    const info = splitPath(p);
    return info.name;
  });

  return segments.join(".");
};

export const getSymbolDisplay = (identifier: Identifier, path: string[]) => {
  const include = path[0];
  const symbolName = getSymbolName(path);

  return `${include} :: ${identifier} :: ${symbolName}`;
};

export const getSymbolAmDocsLink = (path: string[]) => {
  const [include, ...rest] = path;

  const segments = rest.map((s) => {
    const info = splitPath(s);
    return info.name;
  });

  return `${AM_DOCS_URL}/${include}/${segments.join("/")}`;
};

export const getSymbolSmDevDocsLink = (path: string[]) => {
  return `${SM_DEV_DOCS_URL}/${path.join("/")}`;
};

export const getSymbolsForQuery = async (query: string) => {
  const results = await symbolsManager.search("core", query);
  const relevant = results.filter((r) => r.part === Part.Name);
  const truncated = relevant.slice(0, 25);

  return truncated.map((s) => ({
    name: getSymbolDisplay(s.identifier, s.path).slice(0, 100),
    value: getSymbolPath(s.path).slice(0, 100),
  }));
};

export const limitEntries = (arr: string[], limit: number, path: string[]) => {
  if (arr.length <= limit) {
    return arr;
  }

  const remaining = arr.length - limit;
  const clampedArr = arr.slice(0, limit);

  return [
    ...clampedArr,
    `\n**${remaining} more entries** can be viewed on:`,
    `[AlliedModders documentation](${getSymbolAmDocsLink(path)})`,
    `[sourcemod.dev documentation](${getSymbolSmDevDocsLink(path)})`,
  ];
};

export const formatEntry = (entry: Entry) => {
  const header = !entry.docs ? "\n" : `\n${entry.docs.brief}\n`;
  return header + buildCode(entry.name);
};

export const formatFunctionDecls = (func: Function) => {
  return func.arguments.map((a) => {
    return !a.default ? a.decl : `${a.decl} = ${a.default}`;
  });
};

export const formatTypeSet = (typeset: TypeSet, path: string[]) => {
  const types = Object.values(typeset.types);
  const formatted = types.map((t) => formatTypeDef(t));

  const lines = limitEntries(formatted, MAX_TYPESET_DEFS, path);
  return lines.join("\n");
};

export const formatTypeDef = (typedef: IType) => {
  const header = !typedef.docs ? "" : `${typedef.docs.brief}\n`;
  return header + buildCodeBlock("c", typedef.type);
};

export const formatFunction = (func: Function) => {
  const decls = formatFunctionDecls(func);

  const args = func.arguments.length <= MAX_FUNCTION_ARGS_INLINE
    ? decls.join(", ")
    : `\n\t${decls.join(", \n\t")}\n`;

  return buildCodeBlock("c", `${func.kind} ${func.returnType} ${func.name}(${args})`);
};

export const formatEnumeration = (enumeration: Enumeration, path: string[]) => {
  const entries = Object.values(enumeration.entries);
  const formatted = entries.map((e) => formatEntry(e));

  const lines = limitEntries(formatted, MAX_ENUM_MEMBERS, path);
  return lines.join("\n");
};

export const formatMethodMap = (methodmap: MethodMap, path: string[]) => {
  let header = !methodmap.parent
    ? buildCode(methodmap.name)
    : buildCode(`${methodmap.name} < ${methodmap.parent}`);

  const constructor = methodmap.methods[methodmap.name];
  if (constructor) {
    header += "\n" + formatFunction(constructor);
  }

  const allMethods = Object.values(methodmap.methods);
  const allProperties = Object.values(methodmap.properties);

  const methods = allMethods.map((m) => `Function: ${buildCode(m.name)}`);
  const properties = allProperties.map((m) => `Property: ${buildCode(m.name)}`);

  const maxEntries = MAX_METHODMAP_METHODS + MAX_METHODMAP_PROPERTIES;

  const methodsAmt = Math.max(MAX_METHODMAP_METHODS, maxEntries - properties.length);
  const propertiesAmt = maxEntries - methodsAmt;

  const members = [
    ...methods.slice(0, methodsAmt),
    ...properties.slice(0, propertiesAmt),
    ...methods.slice(methodsAmt),
    ...properties.slice(propertiesAmt),
  ];

  const lines = limitEntries(members, maxEntries, path);
  return header + "\n\n" + lines.join("\n");
};

export const formatSymbol = (symbol: ClassSymbol, path: string[]) => {
  const normalizedIdentifier = normalizeIdentifier(symbol.identifier);

  switch (normalizedIdentifier) {
  case Identifier.TypeSet:
    return formatTypeSet(symbol as TypeSet, path);

  case Identifier.TypeDefinition:
    return formatTypeDef(symbol as TypeDefinition);

  case Identifier.Function:
    return formatFunction(symbol as Function);

  case Identifier.Enumeration:
    return formatEnumeration(symbol as Enumeration, path);

  case Identifier.MethodMap:
    return formatMethodMap(symbol as MethodMap, path);

  default:
    return buildCode(symbol.name);
  }
};

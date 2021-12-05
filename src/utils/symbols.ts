import { DocSymbol } from "../types/DocSymbol";

import {
  Type,
  TypeSet,
  Function,
  MethodMap,
  Identifier,
  Enumeration,
} from "../types/sp-gid-typings";

import {
  AM_DOCS_URL,
  SM_DEV_DOCS_URL,
  MAX_ENUM_MEMBERS,
  MAX_TYPESET_DEFS,
  MAX_METHODMAP_METHODS,
  MAX_METHODMAP_PROPERTIES,
  MAX_FUNCTION_ARGS_INLINE
} from "../constants";

import { buildCode, buildCodeBlock } from "./index";

export const getSymbolDisplay = (s: DocSymbol) => {
  return `${s.include} :: ${s.identifier} :: ${s.name}`;
};

export const getSymbolFullName = (s: DocSymbol) => {
  return `${s.include}/${s.identifier}/${s.name}`;
};

export const getSymbolAmDocsLink = (s: DocSymbol) => {
  const [parentName, childName = ""] = s.name.split(".");
  const [, childType = ""] = s.identifier.split("_");

  return !childType || !childName
    ? `${AM_DOCS_URL}/${s.include}/${parentName}`
    : `${AM_DOCS_URL}/${s.include}/${parentName}/${childName}`;
};

export const getSymbolSmDevDocsLink = (s: DocSymbol) => {
  const [parentName, childName = ""] = s.name.split(".");
  const [parentType, childType = ""] = s.identifier.split("_");

  return !childType || !childName
    ? `${SM_DEV_DOCS_URL}/${s.include}/${parentType}.${parentName}`
    : `${SM_DEV_DOCS_URL}/${s.include}/${parentType}.${parentName}/${childType}.${childName}`;
};

export const getSymbolsForQuery = (query: string, allSymbols: DocSymbol[]) => {
  const lowerQuery = query.toLowerCase();

  // Interactions are limited to 25 results
  const results = allSymbols
    .filter((s) => getSymbolFullName(s).toLowerCase().includes(lowerQuery))
    .slice(0, 25);

  return results;
};

export const limitEntries = (arr: string[], limit: number, symbol: DocSymbol) => {
  if (arr.length <= limit) {
    return arr;
  }

  const remaining = arr.length - limit;
  const clampedArr = arr.slice(0, limit);

  return [
    ...clampedArr,
    `\n**${remaining} more entries** can be viewed on:`,
    `[AlliedModders documentation](${getSymbolAmDocsLink(symbol)})`,
    `[sourcemod.dev documentation](${getSymbolSmDevDocsLink(symbol)})`,
  ];
};

export const formatFunctionDecls = (func: Function) => {
  return func.arguments.map((a) => {
    return !a.default ? a.decl : `${a.decl} = ${a.default}`;
  });
};

export const formatTypeSet = (typeset: TypeSet & DocSymbol) => {
  const defs = typeset.types.map((t) => formatTypeDef(t));
  const lines = limitEntries(defs, MAX_TYPESET_DEFS, typeset);
  return lines.join("\n");
};

export const formatTypeDef = (typedef: Type) => {
  const header = !typedef.docs ? "" : `${typedef.docs.brief}\n`;
  return header + buildCodeBlock("c", typedef.type);
};

export const formatFunction = (func: Function) => {
  const decls = formatFunctionDecls(func);

  const args = func.arguments.length < MAX_FUNCTION_ARGS_INLINE
    ? decls.join(", ")
    : `\n\t${decls.join(", \n\t")}\n`;

  return buildCodeBlock("c", `${func.kind} ${func.returnType} ${func.name}(${args})`);
};

export const formatEnumeration = (enumeration: Enumeration & DocSymbol) => {
  const names = enumeration.entries.map((e) => buildCode(e.name));
  const lines = limitEntries(names, MAX_ENUM_MEMBERS, enumeration);
  return lines.join("\n");
};

export const formatMethodMap = (methodmap: MethodMap & DocSymbol) => {
  let header = !methodmap.parent
    ? buildCode(methodmap.name)
    : buildCode(`${methodmap.name} < ${methodmap.parent}`);

  // A constructor is present if a method is equal to the symbol's name
  const constructor = methodmap.methods.find((m) => m.name === methodmap.name);
  if (constructor) {
    header += "\n" + formatFunction(constructor);
  }

  const availableMethods = methodmap.methods.filter((m) => m.name !== constructor?.name);

  const methods = availableMethods.map((m) => `Function: ${buildCode(m.name)}`);
  const properties = methodmap.properties.map((m) => `Property: ${buildCode(m.name)}`);

  const maxEntries = MAX_METHODMAP_METHODS + MAX_METHODMAP_PROPERTIES;

  const methodsAmt = Math.max(MAX_METHODMAP_METHODS, maxEntries - properties.length);
  const propertiesAmt = maxEntries - methodsAmt;

  const members = [
    ...methods.slice(0, methodsAmt),
    ...properties.slice(0, propertiesAmt),
    ...methods.slice(methodsAmt),
    ...properties.slice(propertiesAmt),
  ];

  const lines = limitEntries(members, maxEntries, methodmap);
  return header + "\n\n" + lines.join("\n");
};

export const formatSymbol = (symbol: DocSymbol) => {
  switch (symbol.tag) {
    case Identifier.TypeSet:
      return formatTypeSet(symbol);

    case Identifier.TypeDefinition:
      return formatTypeDef(symbol);

    case Identifier.Function:
      return formatFunction(symbol);

    case Identifier.Enumeration:
      return formatEnumeration(symbol);

    case Identifier.MethodMap:
      return formatMethodMap(symbol);

    default:
      return buildCode(symbol.name);
  }
};

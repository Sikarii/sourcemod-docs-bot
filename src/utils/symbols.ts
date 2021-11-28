import { Argument } from "../types/sp-gid-typings";
import { DocSymbol } from "../types/DocSymbol";

export const getSymbolDisplay = (s: DocSymbol) => {
  return `${s.include} :: ${s.identifier} :: ${s.name}`;
};

export const getSymbolFullName = (s: DocSymbol) => {
  return `${s.include}/${s.identifier}/${s.name}`;
};

export const getArgumentDecl = (arg: Argument) => {
  return !arg.default
    ? `${arg.decl}`
    : `${arg.decl} = ${arg.default}`;
};

export const getSymbolsForQuery = (query: string, allSymbols: DocSymbol[]) => {
  const lowerQuery = query.toLowerCase();

  // Interactions are limited to 25 results
  const results = allSymbols
    .filter((s) => getSymbolFullName(s).toLowerCase().includes(lowerQuery))
    .slice(0, 25);

  return results;
};

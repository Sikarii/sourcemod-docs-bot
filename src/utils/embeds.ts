import { MessageEmbed } from "discord.js";

import { DocSymbol } from "../types/DocSymbol";
import { Identifier } from "../types/sp-gid-typings";

import { getArgumentDecl } from "./symbols";
import { buildCodeBlock, capitalizeString } from "./index";

import {
  AM_DOCS_URL,
  SM_DEV_DOCS_URL,
  SYMBOLS_SOURCE_URL
} from "../constants";

export const buildErrorEmbed = (error: Error | string) => {
  const msg = error instanceof Error ? error.message : error;

  const embed = new MessageEmbed();

  embed.setColor("#FF0000");
  embed.setDescription(`:x: ${msg}`);

  return embed;
};

export const buildSuccessEmbed = (message: string) => {
  const embed = new MessageEmbed();

  embed.setColor("#BFFF00");
  embed.setDescription(`:white_check_mark: ${message}`);

  return embed;
};

export const buildSymbolEmbed = (symbol: DocSymbol) => {
  const embed = new MessageEmbed();

  const prettyIdentifier = symbol.identifier
    .split("_")
    .map((w) => capitalizeString(w))
    .join(" ");

  embed.setTitle(`${symbol.name} (${prettyIdentifier})`);
  embed.setColor("#5865F2");

  const [parentName, childName = ""] = symbol.name.split(".");
  const [parentType, childType = ""] = symbol.identifier.split("_");

  const amDocsLink = !childType || !childName
    ? `${AM_DOCS_URL}/${symbol.include}/${parentName}`
    : `${AM_DOCS_URL}/${symbol.include}/${parentName}/${childName}`;

  const sourcemodDevLink = !childType || !childName
    ? `${SM_DEV_DOCS_URL}/${symbol.include}/${parentType}.${parentName}`
    : `${SM_DEV_DOCS_URL}/${symbol.include}/${parentType}.${parentName}/${childType}.${childName}`;

  const lines = [];
  lines.push(`[AlliedModders documentation](${amDocsLink})`);
  lines.push(`[sourcemod.dev documentation](${sourcemodDevLink})`);

  // Add prototype if is a function
  if (symbol.tag === Identifier.Function) {
    const decls = symbol.arguments
      .map((a) => getArgumentDecl(a))
      .join(", ");

    lines.push(
      buildCodeBlock("c", `${symbol.kind} ${symbol.returnType} ${symbol.name}(${decls})`)
    );
  }

  lines.push("");
  lines.push(symbol.docs?.brief ?? "No description available");

  embed.setFooter(`Symbols provided and parsed from: ${SYMBOLS_SOURCE_URL}`);
  embed.setDescription(lines.join("\n"));

  return embed;
};

import { MessageEmbed } from "discord.js";
import { ClassSymbol } from "@sourcemod-dev/schema";

import {
  formatSymbol,
  getSymbolName,
  getSymbolAmDocsLink,
  getSymbolSmDevDocsLink,
} from "./symbols";

import { SYMBOLS_SOURCE_URL } from "../constants";

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

export const buildSymbolEmbed = (symbol: ClassSymbol, path: string[]) => {
  const embed = new MessageEmbed();

  const identifier = symbol.identifier.replaceAll("_", " ");
  const description = symbol.docs?.brief ?? "";

  const symbolName = getSymbolName(path);

  embed.setColor("#5865F2");
  embed.setTitle(`${symbolName} (${identifier})`);

  embed.setFooter({
    text: `Symbols provided and parsed from: ${SYMBOLS_SOURCE_URL}`,
  });

  embed.description = `[AlliedModders documentation](${getSymbolAmDocsLink(path)})\n`;
  embed.description += `[sourcemod.dev documentation](${getSymbolSmDevDocsLink(path)})\n\n`;

  embed.description += `${formatSymbol(symbol, path)}\n\n`;
  embed.description += description;

  return embed;
};

import { MessageEmbed } from "discord.js";

import { DocSymbol } from "../types/DocSymbol";

import {
  formatSymbol,
  getSymbolAmDocsLink,
  getSymbolSmDevDocsLink
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

export const buildSymbolEmbed = (symbol: DocSymbol) => {
  const embed = new MessageEmbed();

  const identifier = symbol.identifier.replaceAll("_", " ");
  const description = symbol.docs?.brief ?? "";

  embed.setColor("#5865F2");
  embed.setTitle(`${symbol.name} (${identifier})`);

  embed.setFooter(`Symbols provided and parsed from: ${SYMBOLS_SOURCE_URL}`);

  embed.description = `[AlliedModders documentation](${getSymbolAmDocsLink(symbol)})\n`;
  embed.description += `[sourcemod.dev documentation](${getSymbolSmDevDocsLink(symbol)})\n\n`;

  embed.description += `${formatSymbol(symbol)}\n\n`;
  embed.description += description;

  return embed;
};

import { Util } from "discord.js";
import { CommandDefinition } from "../types/CommandDefinition";

export const defineCommand = (command: CommandDefinition) => command;

export const buildCode = (input: string) => {
  const clean = Util.escapeInlineCode(input);
  return `\`${clean}\``;
};

export const buildCodeBlock = (language: string, input: string) => {
  const clean = Util.escapeCodeBlock(input);
  return `\`\`\`${language}\n${clean}\`\`\``;
};

export * from "./embeds";
export * from "./symbols";

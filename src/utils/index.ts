import axios from "axios";
import { Util } from "discord.js";

import { CommandDefinition } from "../types/CommandDefinition";

export const defineCommand = (command: CommandDefinition) => command;

export const debounce = (timeout: number, func: (...args: any[]) => unknown) => {
  let timer: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
};

export const buildCodeBlock = (language: string, input: string) => {
  const clean = Util.escapeCodeBlock(input);
  return `\`\`\`${language}\n${clean}\`\`\``;
};

export const fetchAsJson = async (url: string) => {
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      return undefined;
    }

    return response.data;
  } catch (e) {
    return undefined;
  }
};

export * from "./embeds";
export * from "./symbols";
export * from "./filesystem";

import { MessageEmbed } from "discord.js";

export const buildWorkingEmbed = (message: string) => {
  const embed = new MessageEmbed();

  embed.setColor("GREY");
  embed.setDescription(`:wrench: ${message}`);

  return embed;
};

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

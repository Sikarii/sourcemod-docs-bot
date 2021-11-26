import { CommandInteraction, ApplicationCommandOptionData } from "discord.js";

import { CommandPermission } from "./CommandPermission";

export interface CommandDefinition {
  description: string;
  permission: CommandPermission;
  options?: ApplicationCommandOptionData[];
  execute: (interaction: CommandInteraction) => Promise<any> | any;
}

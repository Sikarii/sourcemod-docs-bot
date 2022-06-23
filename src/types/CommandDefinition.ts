import { CommandInteraction, ApplicationCommandOptionData } from "discord.js";

import { MaybePromise } from "./MaybePromise";
import { CommandPermission } from "./CommandPermission";

export interface CommandDefinition {
  description: string;
  permission: CommandPermission;
  options?: ApplicationCommandOptionData[];
  execute: (interaction: CommandInteraction) => MaybePromise<unknown>;
}

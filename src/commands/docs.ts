import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

import { CommandPermission } from "../types/CommandPermission";

import {
  defineCommand,
  buildErrorEmbed,
  buildSymbolEmbed
} from "../utils";

import symbolsManager from "../managers/symbols";

export default defineCommand({
  description: "View documentation",
  permission: CommandPermission.Everyone,
  options: [
    {
      type: ApplicationCommandOptionTypes.STRING,
      name: "query",
      required: true,
      autocomplete: true,
      description: "Term to search for",
    },
    {
      type: ApplicationCommandOptionTypes.USER,
      name: "target",
      required: false,
      description: "User to mention",
    },
  ],
  execute(interaction) {
    const query = interaction.options.getString("query", true);
    const target = interaction.options.getUser("target", false);

    const path = query.split("/");
    const symbol = symbolsManager.get("core", path);

    if (!symbol) {
      return interaction.reply({
        ephemeral: true,
        embeds: [buildErrorEmbed("Could not find results for your query")],
      });
    }

    const embed = buildSymbolEmbed(symbol, path);

    return interaction.reply({
      embeds: [embed],
      content: !target
        ? undefined
        : `Documentation suggestion for ${target}:`
    });
  },
});

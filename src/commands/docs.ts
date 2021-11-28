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

    // sourcemod/function/OnPluginStart
    // sourcemod/methodmap_method/GameData.GetAddress
    const [include, ...querySegments] = query.split("/");

    const symbolType = querySegments[0] ?? "";
    const symbolName = querySegments[1] ?? "";

    const symbol = symbolsManager.get(symbolName, include, symbolType);
    if (!symbol) {
      return interaction.reply({
        ephemeral: true,
        embeds: [buildErrorEmbed("Could not find results for your query")],
      });
    }

    const embed = buildSymbolEmbed(symbol);

    return interaction.reply({
      embeds: [embed],
      content: !target
        ? undefined
        : `Documentation suggestion for ${target}:`
    });
  },
});

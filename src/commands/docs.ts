import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

import symbolsManager from "../managers/symbols";
import { CommandPermission } from "../types/CommandPermission";

import { defineCommand } from "../utils";
import { buildErrorEmbed } from "../utils/embeds";

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
  async execute(interaction) {
    const query = interaction.options.getString("query", true);
    const target = interaction.options.getUser("target", false);

    // sourcemod/function/OnPluginStart
    // sourcemod/methodmap_method/GameData.GetAddress
    const [include, ...querySegments] = query.split("/");

    const symbolType = querySegments[0] ?? "";
    const symbolName = querySegments[1] ?? "";

    const [parentName, childName = ""] = symbolName.split(".");
    const [parentType, childType = ""] = symbolType.split("_");

    const symbol = symbolsManager.get(symbolName, include, symbolType);
    if (!symbol) {
      return interaction.followUp({
        ephemeral: true,
        embeds: [buildErrorEmbed("Could not find results for your query")],
      });
    }

    console.log({
      query,
      include,
      symbolType,
      parentType,
      childType,
      parentName,
      childName
    });

    const desc = symbol.docs?.brief ?? "No description available.";

    const amDocsLink = !childType || !childName
      ? `https://sm.alliedmods.net/new-api/${include}/${parentName}`
      : `https://sm.alliedmods.net/new-api/${include}/${parentName}/${childName}`;

    const sourcemodDevLink = !childType || !childName
      ? `https://sourcemod.dev/#/${include}/${parentType}.${parentName}`
      : `https://sourcemod.dev/#/${include}/${parentType}.${parentName}/${childType}.${childName}`;

    const name = symbol.name;
    const message = `**${name}**\n[[AM Docs]](<${amDocsLink}>) [[Sourcemod.dev]](<${sourcemodDevLink}>)\n\n${desc}`;

    const fullMessage = !target
      ? message
      : `Documentation suggestion for ${target.toString()}:\n${message}`;

    return interaction.reply({
      content: fullMessage,
    });
  },
});

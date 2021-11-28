import { CommandPermission } from "../types/CommandPermission";

import {
  defineCommand,
  fetchManifest,
  buildErrorEmbed,
  buildSuccessEmbed
} from "../utils";

import symbolsManager from "../managers/symbols";

export default defineCommand({
  description: "Reload symbols",
  permission: CommandPermission.Owner,
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const includes = await fetchManifest(true);
      const loadedCount = symbolsManager.setFromManifestIncludes(includes);

      return interaction.editReply({
        embeds: [
          buildSuccessEmbed(`Successfully loaded ${loadedCount} symbols`),
        ],
      });
    } catch (e) {
      return interaction.editReply({
        embeds: [buildErrorEmbed("Failed to reload symbols")],
      });
    }
  },
});

import { CommandPermission } from "../types/CommandPermission";

import { defineCommand } from "../utils";
import { fetchManifest } from "../utils/symbols";
import { buildErrorEmbed, buildSuccessEmbed, buildWorkingEmbed } from "../utils/embeds";

import symbolsManager from "../managers/symbols";

export default defineCommand({
  description: "Reload symbols",
  permission: CommandPermission.Owner,
  async execute(interaction) {
    await interaction.reply({
      ephemeral: true,
      embeds: [buildWorkingEmbed("Fetching symbols...")],
    });

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

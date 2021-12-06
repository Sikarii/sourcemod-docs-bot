import { CommandPermission } from "../types/CommandPermission";

import {
  defineCommand,
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
      symbolsManager.removeAll();
      await symbolsManager.loadFromManifestBundle("core");

      const loadedCount = symbolsManager.getCount();

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

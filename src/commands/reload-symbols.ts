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
      await symbolsManager.loadRemote("core");

      return interaction.editReply({
        embeds: [buildSuccessEmbed("Successfully loaded symbols")],
      });
    } catch (err) {
      console.error("Failed reloading symbols", err);

      return interaction.editReply({
        embeds: [buildErrorEmbed("Failed to reload symbols")],
      });
    }
  },
});

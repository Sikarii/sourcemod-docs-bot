import { Client, CommandInteraction, AutocompleteInteraction } from "discord.js";

import { CommandPermission } from "./types/CommandPermission";

import { COMMANDS_DIRECTORY } from "./constants";
import { buildErrorEmbed, getSymbolsForQuery } from "./utils";

import config from "./config";
import logger from "./logger";

import symbolsManager from "./managers/symbols";
import commandsManager from "./managers/commands";

const client = new Client({
  intents: ["GUILDS", "GUILD_INTEGRATIONS"],
});

const handleCommandInteraction = async (interaction: CommandInteraction) => {
  const command = commandsManager.get(interaction.commandName);
  if (!command) {
    return;
  }

  // TODO: Will use this garbage until better application command permissions are implemented
  // See: https://msciotti.notion.site/msciotti/Command-Permissions-V2-4d113cb49090409f998f3bd80a06c3bd
  if (command.permission !== CommandPermission.Everyone
      && command.permission !== CommandPermission.Owner) {
    logger.warning(`BUG: Unhandled permission for command ${command.name}`);

    return interaction.reply({
      ephemeral: true,
      embeds: [buildErrorEmbed("Something went wrong, sorry!")],
    });
  }

  if (command.permission === CommandPermission.Owner && interaction.user.id !== config.ownerId) {
    return interaction.reply({
      ephemeral: true,
      embeds: [buildErrorEmbed("Sorry, this command is only usable by the bot owner")],
    });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.commandError(error, command, interaction.user);

    const embed = buildErrorEmbed("Something went wrong, sorry!");

    if (interaction.replied) {
      return interaction.editReply({
        embeds: [embed],
      });
    }

    return interaction.reply({
      ephemeral: true,
      embeds: [embed],
    });
  }
};

const handleAutocompleteInteraction = async (interaction: AutocompleteInteraction) => {
  const option = interaction.options.getFocused();

  const query = option.toString();
  const results = await getSymbolsForQuery(query);

  return interaction.respond(results);
};

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand()) {
    handleCommandInteraction(interaction);
    return;
  }

  if (interaction.isAutocomplete()) {
    handleAutocompleteInteraction(interaction);
    return;
  }
});

(async function() {
  client.once("ready", () => {
    client?.user?.setPresence({
      activities: [
        {
          type: "PLAYING",
          name: "SourceMod /docs",
        },
      ],
    });

    console.log(`Logged in as ${client.user?.tag}`);
  });

  await symbolsManager.loadRemote("core");
  await commandsManager.loadFromDisk(COMMANDS_DIRECTORY);

  await client.login(config.token);
})();

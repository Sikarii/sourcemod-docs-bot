import axios from "axios";

import config from "../config";
import commandsManager from "../managers/commands";

import { COMMANDS_DIRECTORY, DAPI_APPLICATIONS_URL } from "../constants";

export const deploy = async ({ devOnly = true }) => {
  await commandsManager.loadFromDisk(COMMANDS_DIRECTORY);

  const commands = commandsManager.getAll();
  const appCommands = commands.map((c) => c.toApplicationCommand());

  const routeSuffix = !devOnly ? "" : `/guilds/${config.devGuildId}`;
  const absoluteUrl = `${DAPI_APPLICATIONS_URL}/${config.appId}${routeSuffix}/commands`;

  try {
    const response = await axios.put(absoluteUrl, appCommands, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bot ${config.token}`,
      },
    });

    console.info("Successfully updated slash commands");
    console.info(response.data);
  } catch (error: any) {
    console.error("Failure while updating slash commands");
    console.error(JSON.stringify(error.response.data.errors));
  }
};
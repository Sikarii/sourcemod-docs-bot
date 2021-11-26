import fs from "fs";
import path from "path";

import { CommandDefinition } from "../types/CommandDefinition";
import { CommandPermission } from "../types/CommandPermission";

import { CommandInteraction, ApplicationCommandOptionData } from "discord.js";

export class Command {
  public readonly name: string;
  public readonly description: string;
  public permission: CommandPermission;
  public readonly options: ApplicationCommandOptionData[];
  public readonly execute: (interaction: CommandInteraction) => any | Promise<any>;

  constructor(
    name: string,
    description: string,
    permission: CommandPermission,
    options: ApplicationCommandOptionData[],
    handler: (interaction: CommandInteraction) => any | Promise<any>
  ) {
    this.name = name;
    this.description = description;
    this.permission = permission;
    this.options = options;
    this.execute = handler;
  }

  public toApplicationCommand() {
    return {
      name: this.name,
      options: this.options,
      description: this.description,
      defaultPermission: true,
    };
  }
}

class CommandsManager {
  private readonly commands: Map<string, Command>;

  constructor() {
    this.commands = new Map();
  }

  public add(command: Command) {
    if (this.hasCommand(command.name)) {
      return false;
    }

    this.commands.set(command.name, command);
    return true;
  }

  public get(name: string) {
    return this.commands.get(name);
  }

  public getAll() {
    return [...this.commands.values()];
  }

  public hasCommand(name: string) {
    return this.commands.has(name);
  }

  public update(command: Command) {
    this.commands.set(command.name, command);
  }

  public remove(command: Command) {
    this.commands.delete(command.name);
  }

  public async loadFromDisk(directory: string) {
    const files = await fs.promises.readdir(directory);

    files.forEach((file) => {
      const mod = require(`${directory}/${file}`);

      const commandName = path.parse(file).name;
      const commandData = mod.default as CommandDefinition;

      if (!commandData) {
        throw new Error("Malformed command " + commandName);
      }

      const command = new Command(
        commandName,
        commandData.description,
        commandData.permission,
        commandData.options ?? [],
        commandData.execute
      );

      return this.add(command);
    });
  }
}

export default new CommandsManager();

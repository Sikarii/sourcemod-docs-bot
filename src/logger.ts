import { User, WebhookClient, MessageEmbed, ColorResolvable } from "discord.js";

import config from "./config";
import { Command } from "./managers/commands";

import { buildCodeBlock } from "./utils";

const typeColors: Record<string, ColorResolvable> = {
  "INFO": "BLURPLE",
  "ERROR": "RED",
  "WARNING": "ORANGE",
};

const webhookClient = new WebhookClient({ url: config.loggingWebhookUrl ?? "" });

interface LogOptions {
  type: string;
  message: string;
  context?: any;
  invoker?: User;
}

export class Logger {
  public info(message: string) {
    console.log(message);

    return this.sendWebhookLog({
      type: "INFO",
      message: message,
    });
  }

  public error(message: string, error?: Error) {
    console.error(message, error);

    return this.sendWebhookLog({
      type: "ERROR",
      message: message,
      context: error ? this.errorToJson(error) : undefined,
    });
  }

  public action(message: string, invoker: User) {
    console.log(message, invoker);

    return this.sendWebhookLog({
      type: "INFO",
      invoker: invoker,
      message: message,
    });
  }

  public warning(message: string) {
    console.warn(message);

    return this.sendWebhookLog({
      type: "WARNING",
      message: message,
    });
  }

  public commandError(error: unknown, command: Command, invoker: User) {
    console.error(command, invoker, error);

    return this.sendWebhookLog({
      type: "ERROR",
      context: this.errorToJson(error),
      message: `Failure executing command ${command.name}`,
      invoker: invoker,
    });
  }

  private sendWebhookLog(opts: LogOptions) {
    if (!config.loggingWebhookUrl) {
      return;
    }

    const embed = new MessageEmbed();

    embed.setColor(typeColors[opts.type]);
    embed.addField(opts.type, opts.message);

    if (opts.invoker) {
      embed.setFooter(`Done by ${opts.invoker.tag} (${opts.invoker.id})`);
    }

    if (opts.context) {
      const json = JSON.stringify(opts.context, null, 4);
      embed.addField("Stack trace", buildCodeBlock("json", json));
    }

    embed.setTimestamp(new Date());

    return webhookClient.send({
      embeds: [embed],
    });
  }

  private errorToJson(error: any) {
    return {
      name: error.name,
      message: error.message,
      stackTrace: error.stack?.split("\n").slice(0, 5),
    };
  }
}

export default new Logger();

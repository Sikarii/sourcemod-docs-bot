import "dotenv/config";
import { z } from "zod";

const snowflakeString = z
  .string()
  .regex(/^(\d{17,21})$/, { message: "Must be a snowflake id" });

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(1),
  BOT_APP_ID: z.string().min(1),
  BOT_OWNER_ID: snowflakeString,
  DEV_GUILD_ID: snowflakeString.optional(),
  LOGGING_WEBHOOK_URL: z.string().optional(),
});

const env = EnvSchema.safeParse(process.env);
if (!env.success) {
  console.error("\x1b[31mFailed validating environment variables\x1b[0m");
  console.table(env.error.formErrors.fieldErrors);
  process.exit(1);
}

export default {
  token: env.data.BOT_TOKEN,
  appId: env.data.BOT_APP_ID,
  ownerId: env.data.BOT_OWNER_ID,
  devGuildId: env.data.DEV_GUILD_ID,
  loggingWebhookUrl: env.data.LOGGING_WEBHOOK_URL,
};

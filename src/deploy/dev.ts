import { deploy } from "./index";

import config from "../config";

if (!config.devGuildId) {
  throw new Error("No dev guild configured!");
}

deploy({ devOnly: true });
import path from "path";

export const COMMANDS_DIRECTORY = path.resolve(__dirname, "commands");

export const MANIFEST_DIRECTORY = path.resolve(__dirname, "..", "data", "manifest-bundles");
export const MANIFEST_REMOTE_BASE_URL = "https://cdn.jsdelivr.net/gh/sourcemod-dev/manifest@bundles";

export const DAPI_BASE_URL = "https://discord.com/api/v9";
export const DAPI_APPLICATIONS_URL = `${DAPI_BASE_URL}/applications`;

export const AM_DOCS_URL = "https://sm.alliedmods.net/new-api";
export const SM_DEV_DOCS_URL = "https://sourcemod.dev/#";

export const SYMBOLS_SOURCE_URL = "https://github.com/sourcemod-dev/manifest";

export const MAX_ENUM_MEMBERS = 5;
export const MAX_TYPESET_DEFS = 3;

/*
  Methods will fill for properties,
  in the case theres not enough of them.
*/
export const MAX_METHODMAP_METHODS = 3;
export const MAX_METHODMAP_PROPERTIES = 3;

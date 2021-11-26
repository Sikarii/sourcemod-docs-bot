import path from "path";

export const COMMANDS_DIRECTORY = path.resolve(__dirname, "commands");

export const MANIFEST_DIRECTORY = path.resolve(__dirname, "..", "data", "sp-gid");
export const MANIFEST_FILE_PATH = path.resolve(MANIFEST_DIRECTORY, "include.manifest");
export const MANIFEST_REMOTE_URL = "https://raw.githubusercontent.com/rumblefrog/sp-gid/master/base/include.manifest";

export const DAPI_BASE_URL = "https://discord.com/api/v9";
export const DAPI_APPLICATIONS_URL = `${DAPI_BASE_URL}/applications`;

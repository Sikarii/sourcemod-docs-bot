import fs from "fs";

export const pathExists = async (path: string) => {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
};

export const readFileAsJson = async (file: string) => {
  const exists = await pathExists(file);
  if (!exists) {
    return undefined;
  }

  const text = await fs.promises.readFile(file, "utf-8");

  const json = JSON.parse(text);
  return json;
};

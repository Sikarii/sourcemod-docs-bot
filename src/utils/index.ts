import fs from "fs";
import axios from "axios";

import { CommandDefinition } from "../types/CommandDefinition";

export const defineCommand = (command: CommandDefinition) => command;

export const debounce = (timeout: number, func: (...args: any[]) => unknown) => {
  let timer: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => { console.log("debounced"); func.apply(this, args); }, timeout);
  };
};

export const fetchAsJson = async (url: string) => {
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      return undefined;
    }

    return response.data;
  } catch (e) {
    return undefined;
  }
};

export const pathExists = async (path: string) => {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
};

export const removeIfExists = async (path: string) => {
  const exists = await pathExists(path);
  if (!exists) {
    return;
  }

  return fs.promises.rm(path, {
    recursive: true
  });
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
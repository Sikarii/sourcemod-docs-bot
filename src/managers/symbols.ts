import fs from "fs";
import path from "path";
import { EventEmitter } from "events";

import { Symbol, Identifier } from "../types/sp-gid-typings";

import {
  DocSymbol,
  isValidSection,
  sectionKeyToTag,
  nestedToSingleton,
} from "../types/DocSymbol";

import { readFileAsJson } from "../utils";
import { MANIFEST_DIRECTORY } from "../constants";

import { fetchManifestBundle, ManifestBundle } from "../datasources/manifest-bundle";

export class Symbols extends EventEmitter {
  private readonly symbols: DocSymbol[];

  constructor() {
    super();
    this.symbols = [];
  }

  get(name: string, include: string, identifier: string) {
    return this.symbols.find((s) =>
      s.name === name && s.identifier === identifier && s.include === include
    );
  }

  getAll() {
    return this.symbols;
  }

  getCount() {
    const all = this.getAll();
    return all.length;
  }

  removeAll() {
    this.emit("mutation", "removeAll");
    return this.symbols.splice(0, this.symbols.length);
  }

  register(name: string, include: string, symbol: Symbol, identifier: Identifier) {
    const entry: DocSymbol = {
      ...symbol,
      name: name,
      include: include,
      identifier: identifier,
    };

    entry.tag = nestedToSingleton(identifier);

    this.symbols.push(entry);
    this.emit("register", entry);
    this.emit("mutation", "add");

    return entry;
  }

  registerNested(parent: DocSymbol, symbols: Symbol[], identifier: Identifier) {
    symbols.forEach((symbol) => {
      const name = `${parent.name}.${symbol.name}`;
      this.register(name, parent.include, symbol, identifier);
    });
  }

  async loadFromManifestBundle(name: string) {
    const bundlePath = path.join(MANIFEST_DIRECTORY, `${name}.bundle`);

    let bundle: ManifestBundle;

    try {
      bundle = await fetchManifestBundle(name);

      await fs.promises.mkdir(MANIFEST_DIRECTORY, { recursive: true });
      await fs.promises.writeFile(bundlePath, JSON.stringify(bundle));

    } catch (e) {
      bundle = await readFileAsJson(bundlePath);
      if (!bundle) {
        throw new Error("Could not fetch bundle remotely and no local copy exists!");
      }
    }

    for (const include in bundle.strands) {
      const strand = bundle.strands[include];
      const sections = Object.keys(strand).filter(isValidSection);

      for (const sectionKey of sections) {
        const tag = sectionKeyToTag(sectionKey);

        const section = strand[sectionKey];
        const definitions = Object.values(section);

        for (const definition of definitions) {
          const parent = this.register(definition.symbol.name, include, definition.symbol, tag);

          if (parent.tag === Identifier.MethodMap) {
            this.registerNested(parent, parent.methods, Identifier.MethodMapMethod);
            this.registerNested(parent, parent.properties, Identifier.MethodMapProperty);
          }

          if (parent.tag === Identifier.EnumStruct) {
            this.registerNested(parent, parent.fields, Identifier.EnumStructField);
            this.registerNested(parent, parent.methods, Identifier.EnumStructMethod);
          }
        }
      }
    }
  }
}

export default new Symbols();

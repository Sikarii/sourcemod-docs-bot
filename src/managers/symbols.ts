import { EventEmitter } from "events";

import { Symbol, Identifier } from "../types/symbols";
import { DocSymbol, ManifestIncludes, SectionKey, sectionKeyToTag } from "../types/DocSymbol";

export class Symbols extends EventEmitter {
  private symbols: DocSymbol[];

  constructor() {
    super();
    this.symbols = [];
  }

  get(name: string, include: string, tag: string) {
    return this.symbols.find((s) =>
      s.name === name && s.realTag === tag && s.include === include
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

  register(name: string, include: string, symbol: Symbol, tag?: Identifier) {
    const entry: DocSymbol = {
      ...symbol,
      name: name,
      include: include,
      realTag: tag ?? symbol.tag,
    };

    this.symbols.push(entry);
    this.emit("register", entry);
    this.emit("mutation", "add");
  }

  registerNested(parent: DocSymbol, symbols: Symbol[], tag: Identifier) {
    symbols.forEach((symbol) => {
      const name = `${parent.name}.${symbol.name}`;
      this.register(name, parent.include, symbol, tag);
    });
  }

  setFromManifestIncludes(includes: ManifestIncludes) {
    this.removeAll();

    for (const include in includes) {
      const includeData = includes[include];

      for (const section in includeData) {
        const tag = sectionKeyToTag(section);
        if (!tag) {
          continue;
        }

        const sectionSymbols = includeData[section as SectionKey];

        for (const symbol of sectionSymbols) {
          symbol.tag = tag;
          symbol.include = include;

          this.register(symbol.name, symbol.include, symbol);

          if (symbol.tag === Identifier.MethodMap) {
            this.registerNested(symbol, symbol.methods, Identifier.MethodMapMethod);
            this.registerNested(symbol, symbol.properties, Identifier.MethodMapProperty);
          }

          if (symbol.tag === Identifier.EnumStruct) {
            this.registerNested(symbol, symbol.fields, Identifier.EnumStructField);
            this.registerNested(symbol, symbol.methods, Identifier.EnumStructMethod);
          }
        }
      }
    }

    return this.getCount();
  };
}

export default new Symbols();
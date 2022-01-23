import axios from "axios";
import { EventEmitter } from "events";
import { Bundle, IBundle } from "@sourcemod-dev/schema";

import { MANIFEST_REMOTE_BASE_URL } from "../constants";

export class Symbols extends EventEmitter {
  private readonly bundles: Map<string, Bundle>;

  constructor() {
    super();
    this.bundles = new Map();
  }

  get(bundleName: string, path: string[]) {
    const bundle = this.bundles.get(bundleName);
    if (!bundle) {
      return undefined;
    }

    return bundle.getSymbolByPath(path);
  }

  search(bundleName: string, query: string) {
    const bundle = this.bundles.get(bundleName);
    if (!bundle) {
      return [];
    }

    return bundle.search(query, { parents: [] });
  }

  async loadRemote(bundleName: string) {
    const bundleUrl = `${MANIFEST_REMOTE_BASE_URL}/${encodeURI(bundleName)}.bundle`;

    const response = await axios.get<IBundle>(bundleUrl, {
      timeout: 30000,
      validateStatus: () => true
    });

    if (response.status >= 400) {
      return false;
    }

    const bundle = new Bundle(response.data);

    this.bundles.set(bundleName, bundle);
    return true;
  }
}

export default new Symbols();

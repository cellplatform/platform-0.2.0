import * as t from './types.mjs';
import { DEFAULT } from '../DEFAULT.mjs';

const QS = DEFAULT.QS;

export const WrangleUrlParams = {
  /**
   * Determine if the given URL is a "dev mode" address.
   */
  isDev(location?: t.UrlInput) {
    const params = WrangleUrl.location(location).searchParams;
    return params.has(QS.D) || params.has(QS.DEV);
  },

  formatDevFlag(options: { location?: t.UrlInput } = {}) {
    const url = WrangleUrl.location(options.location);

    if (url.searchParams.has(QS.D)) {
      const value = url.searchParams.get(QS.D) || 'true';
      url.searchParams.delete(QS.D);
      url.searchParams.set(QS.DEV, value);
      if (!options.location) {
        window.location.search = url.searchParams.toString();
      }
    }

    return url;
  },

  ensureIndexDevFlag(options: { location?: t.UrlInput } = {}) {
    const url = WrangleUrl.location(options.location);
    const params = url.searchParams;
    params.delete(DEFAULT.QS.D);
    params.delete(DEFAULT.QS.DEV);
    params.set(DEFAULT.QS.DEV, 'true');
    if (!options.location) {
      window.location.search = url.searchParams.toString();
    }
    return url;
  },
};

export const WrangleUrl = {
  navigate: WrangleUrlParams,

  /**
   * Convert an input location into a standard [URL] object.
   */
  location(value?: t.UrlInput): URL {
    if (!value) return new URL(window.location.href);
    return typeof value === 'string' ? new URL(value) : new URL(value.href);
  },

  /**
   * Derive and load the module from the given URL.
   */
  async module(url: URL, specs: t.Imports) {
    const params = url.searchParams;
    if (!params.has(QS.DEV)) return undefined;

    const namespace = params.get(QS.DEV) ?? '';
    const matches = WrangleUrl.moduleMatches(namespace, specs);

    if (matches[0]) {
      const res = await matches[0].fn();
      if (typeof res !== 'object') return undefined;
      if (res.default?.kind === 'TestSuite') return res.default;
      console.warn(`Imported default from field "${namespace}" is not of kind "TestSuite"`);
    }

    return undefined;
  },

  /**
   * Match fields on the spec {Imports} object with the given query-string key name.
   */
  moduleMatches(field: string, specs: t.Imports) {
    if (!field) return [];
    return Object.keys(specs)
      .filter((key) => key === field)
      .map((namespace) => ({ namespace, fn: (specs as any)[namespace] }))
      .filter(({ fn }) => typeof fn === 'function');
  },
};

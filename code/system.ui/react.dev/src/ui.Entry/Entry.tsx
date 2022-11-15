import { t } from '../common';
import { SpecIndex } from '../ui.SpecIndex';
import { Harness } from '../ui.Harness';

const KEY = { DEV: 'dev' };

export const Entry = {
  /**
   * Render a harness with the selected `dev=namespace` import or an
   * index list of available specs.
   */
  async render(
    pkg: { name: string; version: string },
    specs: t.Imports,
    options: { location?: string | URL | Location; style?: t.CssValue } = {},
  ) {
    const url = Wrangle.location(options.location);
    const spec = await Wrangle.module(url, specs);
    const style = options.style ?? { Absolute: 0 };

    if (spec) {
      return <Harness spec={spec} style={style} />;
    } else {
      return <SpecIndex title={pkg.name} version={pkg.version} imports={specs} style={style} />;
    }
  },
};

/**
 * Helpers
 */

const Wrangle = {
  /**
   * Convert an input location into a standard [URL] object.
   */
  location(value?: string | URL | Location): URL {
    if (!value) return new URL(window.location.href);
    return typeof value === 'string' ? new URL(value) : new URL(value.href);
  },

  /**
   * Derive and load the module from the given URL.
   */
  async module(url: URL, specs: t.Imports) {
    const params = url.searchParams;
    if (!params.has(KEY.DEV)) return undefined;

    const namespace = params.get(KEY.DEV) ?? '';
    const matches = Wrangle.matches(namespace, specs);

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
  matches(field: string, specs: t.Imports) {
    if (!field) return [];
    return Object.keys(specs)
      .filter((key) => key === field)
      .map((namespace) => ({ namespace, fn: (specs as any)[namespace] }))
      .filter(({ fn }) => typeof fn === 'function');
  },
};

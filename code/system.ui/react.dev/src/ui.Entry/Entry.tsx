import { t } from '../common';
import { SpecList } from '../ui.SpecList';
import { Harness } from '../ui.Harness';

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
      return <SpecList title={pkg.name} imports={specs} style={style} />;
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
    const KEY = { DEV: 'dev' };
    const params = url.searchParams;
    if (!params.has(KEY.DEV)) return undefined;

    const dev = params.get(KEY.DEV) ?? '';
    if (dev && Object.keys(specs).includes(dev)) {
      const matches = Object.keys(specs)
        .filter((namespace) => namespace === dev)
        .map((namespace) => ({ namespace, fn: (specs as any)[namespace] }))
        .filter((item) => typeof item.fn === 'function');

      if (matches[0]) {
        const res = await matches[0].fn();
        if (typeof res === 'object') {
          if (res.default.kind === 'TestSuite') {
            return res.default;
          } else {
            console.warn(`Imported default is not of kind "TestSuite"`);
          }
        }
      }
    }

    return undefined;
  },
};

import { t } from '../common';
import { SpecList } from '../ui.SpecList';
import { Harness } from '../ui.Harness';

export const Entry = {
  /**
   * Render the default component
   */
  async render(
    pkg: { name: string; version: string },
    imports: t.Imports,
    options: { location?: string | URL | Location; style?: t.CssValue } = {},
  ) {
    const url = Wrangle.location(options.location);
    const spec = await Wrangle.module(url, imports);
    const style = options.style ?? { Absolute: 0 };

    if (spec) {
      return <Harness spec={spec} style={style} />;
    } else {
      return <SpecList title={pkg.name} imports={imports} style={style} />;
    }
  },
};

/**
 * Helpers
 */

const Wrangle = {
  location(value?: string | URL | Location): URL {
    if (!value) return new URL(window.location.href);
    return typeof value === 'string' ? new URL(value) : new URL(value.href);
  },

  async module(url: URL, imports: t.Imports) {
    const KEY = { DEV: 'dev' };
    const params = url.searchParams;
    if (!params.has(KEY.DEV)) return undefined;

    const dev = params.get(KEY.DEV) ?? '';
    if (dev && Object.keys(imports).includes(dev)) {
      const matches = Object.keys(imports)
        .filter((namespace) => namespace === dev)
        .map((namespace) => ({ namespace, fn: (imports as any)[namespace] }));

      if (matches[0]) {
        const res = await matches[0].fn();
        if (typeof res === 'object') return res.default;
      }
    }

    return undefined;
  },
};

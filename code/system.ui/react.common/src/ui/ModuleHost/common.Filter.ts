import { Fuzzy, t } from '../common';

type Options = { maxErrors?: number };

export const Filter = {
  /**
   * Filter an object of spec imports.
   * Spaces within the filter |→ start a new filter on the prior block (recursively 🌳).
   *
   *    {
   *      'foo.bar': import('path'),
   *      'foo.bar.baz': import('path'),
   *    }
   *
   * Multiple filters can be applied by specifying " | " between each filter.
   */
  specs(all?: t.SpecImports, filter?: string, options: Options = {}): t.SpecImports {
    if (!all) return {};

    const text = (filter || '').trim();
    const filters = text.split(' | ').map((f) => f.trim());
    if (!text) return all;

    const res: t.SpecImports = {};
    filters.forEach((filter) => {
      const filtered = Filter.namespaces(Object.keys(all), filter, options);
      filtered.forEach((ns) => (res[ns] = all[ns]));
    });

    return res;
  },

  /**
   * Filter a list of namespace strings.
   * Spaces within the filter |→ start a new filter on the prior block (recursively 🌳).
   */
  namespaces(all: string[], filter?: string, options: Options = {}): string[] {
    const { maxErrors = 1 } = options;
    const parts = (filter || '').trim().toLowerCase().split(' ');
    if (parts.length === 0) return all;

    const matcher = Fuzzy.pattern(parts[0], { maxErrors });
    const filtered = all.filter((ns) => matcher.match(ns.toLowerCase()).exists);
    if (parts.length < 2) return filtered;

    // ↓ RECURSION 🌳
    return Filter.namespaces(filtered, parts.slice(1).join(' '), options);
  },
};

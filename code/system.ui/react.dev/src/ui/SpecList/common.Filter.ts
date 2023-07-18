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
   */
  specs(all?: t.SpecImports, filter?: string, options: Options = {}): t.SpecImports {
    if (!all) return {};
    if (!(filter || '').trim()) return all;
    return Filter.namespaces(Object.keys(all), filter, options).reduce((acc, key) => {
      acc[key] = all[key];
      return acc;
    }, {} as t.SpecImports);
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

    return Filter.namespaces(filtered, parts.slice(1).join(' '), options); // <== 🌳 RECURSION
  },
};

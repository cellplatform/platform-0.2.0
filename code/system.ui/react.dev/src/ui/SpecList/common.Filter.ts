import { t, Fuzzy } from '../common';

export const Filter = {
  specs(imports?: t.SpecImports, filter?: string): t.SpecImports {
    if (!imports) return {};

    filter = (filter || '').trim();
    if (!(filter || '').trim()) return imports;

    const matcher = Fuzzy.pattern(filter.toLowerCase(), 1);

    return Object.keys(imports).reduce((acc, key) => {
      const match = matcher.match(key.toLowerCase());
      if (match.exists) acc[key] = imports[key];
      return acc;
    }, {} as t.SpecImports);
  },
};

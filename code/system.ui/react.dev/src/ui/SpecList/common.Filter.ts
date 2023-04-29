import { t, Fuzzy } from '../common';

export const Filter = {
  specs(
    imports?: t.SpecImports,
    filter?: string,
    options: { maxErrors?: number } = {},
  ): t.SpecImports {
    if (!imports) return {};

    filter = (filter || '').trim();
    if (!filter) return imports;

    const { maxErrors = 1 } = options;
    const matcher = Fuzzy.pattern(filter.toLowerCase(), maxErrors);

    return Object.keys(imports).reduce((acc, key) => {
      const match = matcher.match(key.toLowerCase());
      if (match.exists) acc[key] = imports[key];
      return acc;
    }, {} as t.SpecImports);
  },
};

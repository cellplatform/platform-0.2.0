export * from '../common';
import { t, Fuzzy } from '../common';

/**
 * Constants.
 */
export const KEY = { DEV: 'dev' };

/**
 * Cacluation utilities.
 */
export const Calc = {
  showHr(depth: number, prev: string, next: string): boolean {
    if (typeof depth !== 'number') return false;
    if (typeof prev !== 'string' || typeof next !== 'string') return false;

    if (depth > 1) {
      const split = (value: string) => value.split('.').slice(0, depth).join('.');

      const parts = {
        prev: split(prev),
        next: split(next),
      };

      if (parts.prev !== parts.next) return true;
    }
    return false;
  },
};

export const Filter = {
  specs(imports?: t.SpecImports, filter?: string): t.SpecImports {
    if (!imports) return {};

    filter = (filter || '').trim();
    if (!(filter || '').trim()) return imports;

    const matcher = Fuzzy.pattern(filter, 1);

    return Object.keys(imports).reduce((acc, key) => {
      const match = matcher.match(key);
      if (match.exists) acc[key] = imports[key];
      return acc;
    }, {} as t.SpecImports);
  },
};

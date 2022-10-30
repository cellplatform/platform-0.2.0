import { R } from './common.mjs';

export type ShowMarkdownComponent = 'outline' | 'doc' | 'outline|doc' | 'editor';

const DEFAULT = {
  show: ['outline|doc'] as ShowMarkdownComponent[],
};

const ALL = {
  show: ['outline', 'doc', 'outline|doc', 'editor'] as ShowMarkdownComponent[],
};

/**
 * Query-string schema.
 */
export const QueryString = {
  DEFAULT,

  /**
   * /?show=
   */
  show(input?: string | URL): ShowMarkdownComponent[] {
    if (!input) return DEFAULT.show;

    const key = 'show';
    const url = typeof input === 'string' ? new URL(input) : input;
    if (!url || !url.searchParams.has(key)) return DEFAULT.show;

    const values = url.searchParams.getAll(key).map((v) => v.toLowerCase());
    return uniq<ShowMarkdownComponent>(values, ALL.show);
  },
};

/**
 * [Helpers]
 */

function uniq<T extends string>(input: string[], all?: T[]): T[] {
  let _res: T[] = [];
  input.forEach((item) => {
    item = item.trim();
    if (item.includes(',')) {
      item.split(',').forEach((value) => _res.push(value.trim() as T));
    } else {
      _res.push(item as T);
    }
  });
  _res = R.uniq(_res);
  if (Array.isArray(all)) _res = _res.filter((value) => all.includes(value));
  return _res;
}

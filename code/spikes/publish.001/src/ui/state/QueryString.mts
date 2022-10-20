import { R } from '../common.mjs';

export type ShowMarkdownComponent = 'editor' | 'outline';

const DEFAULT = {
  show: ['outline'] as ShowMarkdownComponent[],
};

export const QueryString = {
  show(input?: string | URL): ShowMarkdownComponent[] {
    if (!input) return DEFAULT.show;

    const key = 'show';
    const url = typeof input === 'string' ? new URL(input) : input;
    if (!url || !url.searchParams.has(key)) return DEFAULT.show;

    const values = url.searchParams.getAll(key).map((v) => v.toLowerCase());
    const all: ShowMarkdownComponent[] = ['editor', 'outline'];
    return uniq<ShowMarkdownComponent>(values, all);
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

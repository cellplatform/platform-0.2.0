import { R } from '../common.mjs';

export type ShowMarkdownComponent = 'editor' | 'outline';

const DEFAULT = {
  show: ['editor', 'outline'] as ShowMarkdownComponent[],
};

export const QueryString = {
  show(url?: URL): ShowMarkdownComponent[] {
    const key = 'show';
    if (!url || !url.searchParams.has(key)) return DEFAULT.show;
    const values = url.searchParams.getAll(key).map((v) => v.toLowerCase());
    const all: ShowMarkdownComponent[] = ['editor', 'outline'];
    return QueryString.uniq<ShowMarkdownComponent>(values, all);
  },

  uniq<T extends string>(input: string[], all?: T[]): T[] {
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
  },
};

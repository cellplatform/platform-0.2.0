import { R } from './common';

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
    const url = asUrl(input);
    if (!url) return DEFAULT.show;

    if (QueryString.isDev(input)) {
      /**
       * Behavior Decision Rule: 🌳
       *    Force editor visible in "Dev" mode.
       */
      url.search = '?dev&show=outline|doc,editor';
    }

    // const query = asQuery(input);
    const query = url.searchParams;
    if (!query) return DEFAULT.show;

    const KEY = 'show';
    if (!query.has(KEY)) return DEFAULT.show;

    const values = query.getAll(KEY).map((v) => v.toLowerCase());
    return uniq<ShowMarkdownComponent>(values, ALL.show);
  },

  /**
   * /?dev
   * /?d
   */
  isDev(input?: string | URL) {
    const query = asQuery(input);
    if (!query) return false;

    const KEY = 'dev';
    return query.has(KEY) && query.get('dev') !== 'false';
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

function asUrl(input?: string | URL) {
  if (!input) return;
  return typeof input === 'string' ? new URL(input) : input;
}

function asQuery(input?: string | URL) {
  const url = asUrl(input);
  return url ? url.searchParams : undefined;
}

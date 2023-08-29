export type ShortenHashOptions = {
  trimPrefix?: boolean | string | string[];
  divider?: string;
};

/**
 * Shorten a hash for display, format: "left .. right"
 */
export function shortenHash(
  hash: string,
  length: number | [number, number],
  options: ShortenHashOptions = {},
) {
  const { divider = ' .. ' } = options;

  hash = Wrangle.trimPrefixes((hash || '').trim(), options);
  if (!hash) return '';

  const lengths = Array.isArray(length) ? length : [length, length];
  const left = hash.slice(0, lengths[0]);
  const right = hash.slice(0 - lengths[1]);

  if (lengths[0] <= 0) return right;
  if (lengths[1] <= 0) return left;

  return `${left}${divider}${right}`;
}

/**
 * Helpers
 */

const Wrangle = {
  trimPrefixes(hash: string, options: ShortenHashOptions): string {
    const dividers = Wrangle.prefixDivider(options);
    for (const divider of dividers) {
      const index = hash.indexOf(divider);
      if (index > -1) return hash.slice(index + divider.length);
    }
    return hash;
  },

  prefixDivider(options: ShortenHashOptions) {
    const input = options.trimPrefix;
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') return [input];
    return ['-', ':'];
  },
};

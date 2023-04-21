export type ShortenHashOptions = { trimPrefix?: boolean | string | string[] };

/**
 * Shorten a hash for display, format: "left .. right"
 */
export function shortenHash(
  hash: string,
  length: number | [number, number],
  options: ShortenHashOptions = {},
) {
  hash = (hash || '').trim();
  const lowercase = hash.toLowerCase();
  const startsWith = (prefix: string) => lowercase.startsWith(prefix.toLowerCase());

  Wrangle.trimPrefixes(options.trimPrefix).forEach((prefix) => {
    if (startsWith(prefix)) hash = hash.slice(prefix.length);
  });

  const lengths = Array.isArray(length) ? length : [length, length];
  const left = hash.slice(0, lengths[0]);
  const right = hash.slice(0 - lengths[1]);

  return `${left} .. ${right}`;
}

/**
 * Helpers
 */

const Wrangle = {
  trimPrefixes(input: ShortenHashOptions['trimPrefix']): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') return [input];
    return ['sha256-', 'sha1-', 'sha512-', 'md5-']; // Defaults.
  },
};

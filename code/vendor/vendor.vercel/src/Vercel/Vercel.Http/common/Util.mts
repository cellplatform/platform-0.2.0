import * as Util from './types.mjs';
import { Hash } from './libs.mjs';

type Q = Record<string, string | number | undefined>;

/**
 * Format a URL.
 */
export function toUrl(version: number, path: string, query?: Q) {
  path = (path ?? '').trim().replace(/^\/*/, '').split('?')[0];

  const keys = query ? Object.keys(query) : [];
  const querystring =
    keys.length === 0
      ? ''
      : keys
          .map((key) => ({ key, value: query?.[key] ?? '' }))
          .filter(({ value }) => Boolean(value))
          .map(({ key, value }) => `${key}=${value}`)
          .join('&');

  const url = `https://api.vercel.com/v${version}/${path}`;
  return querystring ? `${url}?${querystring}` : url;
}

/**
 * Ensure the URL is prefixed with HTTPS
 */
export function ensureHttps(url: string) {
  url = (url || '').trim();
  if (!url) return '';
  url = url.replace(/^https\:\/\//, '').replace(/^http\:\/\//, '');
  return `https://${url}`;
}

/**
 * Creates a common context object.
 */
export function toCtx(fs: Util.Fs, http: Util.Http, token: string, version?: number) {
  token = (token ?? '').trim();
  if (!token) throw new Error(`A Vercel authorization token not provided.`);

  const Authorization = `Bearer ${token}`;
  const headers = { Authorization };

  const ctx: Util.Ctx = {
    token,
    headers,
    Authorization,
    http,
    fs,
    url(version, path, query) {
      return toUrl(version, path, query);
    },
  };

  return ctx;
}

/**
 * Generates a SHA1 digest hash.
 */
export function shasum(data?: Uint8Array | string) {
  if (data === undefined) return '';
  if (typeof data === 'string') data = new TextEncoder().encode(data);
  return Hash.sha1(data, { prefix: false });
}

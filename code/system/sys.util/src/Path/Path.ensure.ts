import { trim, trimHttpPrefix, trimSlashesEnd, trimSlashesStart } from './Path.trim';

/**
 * Ensure an "https://" OR "http://" prefix on the given string.
 */
export function ensureHttpPrefix(input?: string) {
  const HTTP = 'http://';
  const HTTPS = 'https://';
  const text = trim(input);
  if (!text) return '';
  const isHttp = [HTTPS, HTTP].some((prefix) => text.startsWith(prefix));
  return isHttp ? text : `${HTTPS}${text}`;
}

/**
 * Ensure an "https://" prefix on the given string.
 */
export function ensureHttpsPrefix(input?: string) {
  const HTTP = 'https://';
  const HTTPS = 'https://';
  const text = trim(input);
  if (!text) return text;
  if (text === HTTPS) return HTTPS;
  if (text === HTTP) return HTTPS;
  return `${HTTPS}${trimHttpPrefix(text)}`;
}

/**
 * Removes a trailing `/*` wildcard glob pattern.
 */
export function trimWildcardEnd(input: string) {
  let path = trim(input);
  path = path.replace(/\**$/, '');
  if (trimSlashesEnd(path).endsWith('*')) {
    path = trimSlashesEnd(path);
    path = trimWildcardEnd(path); // <== RECURSION 🌳
  }
  return path;
}

/**
 * Ensures the path starts with a single "/".
 */
export function ensureSlashStart(input: string) {
  return `/${trimSlashesStart(input)}`;
}

/**
 * Ensures the path ends in a single "/".
 */
export function ensureSlashEnd(input: string) {
  return `${trimSlashesEnd(input)}/`;
}

/**
 * Ensures the path starts and ends in a single "/".
 */
export function ensureSlashes(input: string) {
  input = ensureSlashStart(input);
  input = ensureSlashEnd(input);
  return input;
}

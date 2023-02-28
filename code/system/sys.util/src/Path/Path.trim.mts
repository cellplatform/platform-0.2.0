/**
 * Trim whitespace.
 */
export function trim(input: any) {
  return typeof input === 'string' ? (input || '').trim() : '';
}

/**
 * Trims slashes from the start (left) of a string.
 */
export function trimSlashesStart(input: string) {
  return trim(input).replace(/^\/*/, '').trim();
}

/**
 * Trims slashes from the start (left) of a string.
 */
export function trimSlashesEnd(input: string) {
  return trim(input).replace(/\/*$/, '').trim();
}

/**
 * Trims slashes from the start (left) of a string.
 */
export function trimSlashes(input: string) {
  input = trimSlashesStart(input);
  input = trimSlashesEnd(input);
  return input;
}

/**
 * Remove http/https prefix.
 */
export function trimHttpPrefix(input: string) {
  return trim(input)
    .replace(/^http:\/\//, '')
    .replace(/^https:\/\//, '');
}

/**
 * Ensure an "https://" OR "http://" prefix on the given string.
 */
export function ensureHttpPrefix(input?: string) {
  const text = trim(input);
  const https = 'https://';
  const isHttp = [https, 'http://'].some((prefix) => text.startsWith(prefix));
  return isHttp ? text : `${https}${text}`;
}

/**
 * Ensure an "http://" prefix on the given string.
 */
export function ensureHttpsPrefix(input?: string) {
  const https = 'https://';
  return typeof input !== 'string' ? https : `${https}${trimHttpPrefix(input)}`;
}

/**
 * Trims the "file://" prefix if present
 */
export function trimFilePrefix(input: string) {
  return trim(input).replace(/^file:\/\//, '');
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

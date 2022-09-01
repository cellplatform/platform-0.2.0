import { trim, trimSlashesStart } from '../Path/Path.trim.mjs';
import { join } from '../Path/Path.join.mjs';

/**
 * A string URI that represents the path to a file.
 * Example:
 *
 *    "path:foo/bar.png"
 *
 */
export const PathUri = {
  prefix: 'path',

  /**
   * Determines if the given string is a "path:" URI.
   */
  is(input?: string) {
    const uri = trim(input);
    return uri.startsWith('path:');
  },

  /**
   * Retrieves the path from the given URI.
   */
  path(input?: string) {
    if (!PathUri.is(input)) return undefined;
    const uri = trim(input);

    let res = uri
      .substring(PathUri.prefix.length + 1)
      .replace(/^\.{3,}/, '') // Clean up 3 or more "..." (eg: "..../foo").
      .replace(/^\/*/, '');

    if (res.startsWith('./')) res = res.substring(2);

    return join(res); // NB: The "join" call passes the path through a "../.." resolver.
  },

  /**
   * Ensures the given string is trimmed and has "path:" as a prefix
   */
  ensurePrefix(path: string) {
    if (typeof path !== 'string') return '';
    path = PathUri.trimPrefix(path);
    path = trimSlashesStart(path);
    return `path:${path}`;
  },

  /**
   * Remotes the "path:" prefix from the given string.
   */
  trimPrefix(path: string) {
    path = trim(path);
    return path ? path.replace(/^path:/, '').trim() : '';
  },
};

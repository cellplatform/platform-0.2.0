import {
  trim,
  trimSlashesStart,
  trimSlashesEnd,
  ensureSlashStart,
  ensureSlashEnd,
} from '../Path/Path.trim.mjs';
import { join } from '../Path/Path.join.mjs';

type UriString = string;
type DirPath = string;

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
  isPathUri(input?: UriString) {
    return trim(input).startsWith('path:');
  },

  /**
   * Retrieves a cleaned up path portion from the given URI.
   */
  path(input?: UriString) {
    return PathUri.isPathUri(input) ? cleanPath(input || '') : '';
  },

  /**
   * Ensures the given string is cleaned/trimmed and has "path:" as a prefix
   */
  ensureUriPrefix(input: string, options: { throw?: boolean } = {}) {
    const throwOrReturnInvalid = () => {
      if (options.throw) throw new Error(`Invalid input "${input}"`);
      return '';
    };

    if (typeof input !== 'string') return throwOrReturnInvalid();

    const path = cleanPath(input);
    if (!path) return throwOrReturnInvalid();
    return `path:${path}`;
  },

  /**
   * Remotes the "path:" prefix from the given string.
   */
  trimUriPrefix(input: string) {
    const path = trim(input);
    return path ? path.replace(/^path:/, '').trim() : '';
  },

  /**
   * Perform safe path resolution on a URI.
   */
  resolve(root: DirPath, pathOrUri: string) {
    if (!trim(root)) throw new Error(`Path resolver must have root directory`);
    root = formatRootDir(root);

    const path = PathUri.path(PathUri.ensureUriPrefix(pathOrUri));
    if (!path) {
      const err = `Invalid input "${pathOrUri}".  Must be a valid "path:" uri within scope of the root directory "${root}".`;
      throw new Error(err);
    }

    return join(root, path);
  },

  /**
   * Unpacks a URI into constituent parts.
   */
  unpack(uri: string, options: { root?: DirPath } = {}) {
    const root = options.root && trim(options.root) ? formatRootDir(options.root) : '';

    /**
     * TODO 🐷
     */
    uri = (uri || '').trim();

    return { uri, root };
  },
};

/**
 * Helpers
 */

function cleanPath(path: string): string {
  if (typeof path !== 'string') return '';

  path = path.trim();
  path = PathUri.trimUriPrefix(path);
  if (path === '' || trimSlashesEnd(path) === '.') path = '/';
  if (path.startsWith('./')) path = path.substring(2);
  if (path.startsWith('/')) path = `/${trimSlashesStart(path)}`; // Ensure single leading slash.
  path = path.replace(/^\.{3,}/, '..'); // Clean up 3 or more "..." (eg: "..../foo")
  path = join(path); // NB: The "join" call passes the path through a "../.." resolver.

  return path;
}

function formatRootDir(path: string) {
  path = trim(path);
  path = ensureSlashStart(path);
  path = ensureSlashEnd(path);
  return path;
}

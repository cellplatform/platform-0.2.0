import {
  trim,
  trimSlashesStart,
  trimSlashesEnd,
  ensureSlashStart,
  ensureSlashEnd,
} from '../Path/Path.trim.mjs';
import { join, isWithin } from '../Path/Path.join.mjs';
import { toAbsoluteLocation } from '../Path/Path.to.mjs';
import { t } from '../common/index.mjs';

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
  resolve(root: DirPath, uri: UriString) {
    const { path, error } = resolve(root, uri);
    if (error) throw new Error(error);
    return path;
  },

  /**
   * Factory for a path resolver.
   */
  resolver(dir: DirPath): t.FsPathResolver {
    return (uri: UriString) => PathUri.resolve(dir, uri);
  },

  /**
   * Unpacks a URI into constituent parts.
   */
  unpack(uri: UriString, options: { root?: DirPath } = {}) {
    const root = (options.root && trim(options.root) ? formatRootDir(options.root) : '/') || '/';

    uri = (uri || '').trim();
    if (!PathUri.isPathUri(uri)) {
      throw new Error(`Invalid input URI "${uri}". Should start with "path:.."`);
    }

    const resolved = resolve(root, uri);
    const { error, withinScope } = resolved;

    const rawpath = PathUri.trimUriPrefix(uri);
    uri = PathUri.ensureUriPrefix(uri) || uri; // Clean up URI.

    const fullpath = error ? '' : resolved.path;
    const path = error ? '' : fullpath.substring(root.length - 1); // NB: hide full path up to root of driver scope.
    const location = error ? '' : toAbsoluteLocation({ root, path });

    return { uri, root, path, fullpath, rawpath, location, withinScope, error };
  },

  /**
   * Factory for a URI unpacker.
   */
  unpacker(root?: DirPath) {
    return (uri: UriString) => PathUri.unpack(uri, { root });
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

function resolve(root: DirPath, uri: UriString) {
  type R = { path: string; withinScope: boolean; error?: string };

  const res: R = {
    path: '',
    withinScope: true,
    error: undefined,
  };

  const invalidUriError = (suffix?: string) => `Invalid input URI "${uri}". ${suffix}`.trim();

  if (!trim(root)) {
    res.error = `Path resolver must have root directory`;
    return res;
  }

  root = formatRootDir(root);

  if (!PathUri.isPathUri(uri)) {
    res.error = invalidUriError('Should start with "path:.."');
    return res;
  }

  const withinScope = isWithin(root, PathUri.trimUriPrefix(uri));
  if (!withinScope) {
    res.error = invalidUriError(`Path out of scope of root directory "${root}".`);
    res.withinScope = false;
    return res;
  }

  const path = PathUri.path(PathUri.ensureUriPrefix(uri));
  if (!path) {
    res.error = invalidUriError();
    return res;
  }

  if (withinScope && path) {
    res.path = join(root, path);
  }

  return res;
}

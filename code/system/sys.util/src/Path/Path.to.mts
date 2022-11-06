type O = { root?: string };

/**
 * Convert a value to an absolute path.
 */
export function toAbsolutePath(path: string, options: O = {}) {
  const root = Clean.root(options.root);
  return `${root}/${Clean.path(path, root)}`;
}

/**
 * Convert a value to a relative path, using the home ("~") character.
 */
export function toRelativePath(path: string, options: O = {}) {
  const root = Clean.root(options.root);
  return `~/${Clean.path(path, root)}`;
}

/**
 * Convert a path to a location field value.
 */
export function toAbsoluteLocation(path: string, options: O = {}) {
  return `file://${toAbsolutePath(path, options)}`;
}

/**
 * Convert a path to a relative location, using the home ("~") character.
 */
export function toRelativeLocation(path: string, options: O = {}) {
  return `file://${toRelativePath(path, options)}`;
}

/**
 * [Helpers]
 */

const Clean = {
  root(path?: string) {
    return (path ?? '').trim().replace(/\/*$/, '');
  },

  path(path: string, root?: string) {
    path = (path ?? '').trim().replace(/^file:\/\//, '');
    if (typeof root === 'string') path = path.replace(new RegExp(`^${root}`), '');
    path = path.replace(/^~\//, '').replace(/^\/*/, '');
    return path;
  },
};

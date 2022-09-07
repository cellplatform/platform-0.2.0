/**
 * Convert a value to an absolute path.
 */
export function toAbsolutePath(args: { path: string; root: string }) {
  const root = Clean.root(args.root);
  const path = Clean.path(args.path, root);
  return `${root}/${path}`;
}

/**
 * Convert a value to a relative path, using the home ("~") character.
 */
export function toRelativePath(args: { path: string; root: string }) {
  const root = Clean.root(args.root);
  const path = Clean.path(args.path, root);
  return `~/${path}`;
}

/**
 * Convert a path to a location field value.
 */
export function toAbsoluteLocation(args: { path: string; root: string }) {
  return `file://${toAbsolutePath(args)}`;
}

/**
 * Convert a path to a relative location, using the home ("~") character.
 */
export function toRelativeLocation(args: { path: string; root: string }) {
  return `file://${toRelativePath(args)}`;
}

/**
 * [Helpers]
 */

const Clean = {
  root(path: string) {
    return (path ?? '').trim().replace(/\/*$/, '');
  },

  path(path: string, root: string) {
    return (path ?? '')
      .trim()
      .replace(/^file:\/\//, '')
      .replace(new RegExp(`^${root}`), '')
      .replace(/^~\//, '')
      .replace(/^\/*/, '');
  },
};

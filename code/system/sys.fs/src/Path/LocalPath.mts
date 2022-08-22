/**
 * Helpers for working with paths on a [local] file-system implementation.
 */

export const LocalPath = {
  /**
   * Convert a value to an absolute path.
   */
  toAbsolutePath(args: { path: string; root: string }) {
    const root = Clean.root(args.root);
    const path = Clean.path(args.path, root);
    return `${root}/${path}`;
  },

  /**
   * Convert a valuew to a relative path, using the home ("~") character.
   */
  toRelativePath(args: { path: string; root: string }) {
    const root = Clean.root(args.root);
    const path = Clean.path(args.path, root);
    return `~/${path}`;
  },

  /**
   * Convert a path to a location field value.
   */
  toAbsoluteLocation(args: { path: string; root: string }) {
    return `file://${LocalPath.toAbsolutePath(args)}`;
  },

  /**
   * Convert a path to a relative location, using the home ("~") character.
   */
  toRelativeLocation(args: { path: string; root: string }) {
    return `file://${LocalPath.toRelativePath(args)}`;
  },
};

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

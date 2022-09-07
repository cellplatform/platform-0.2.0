import { Path, PathUri } from '../Path/index.mjs';

type UriString = string;

/**
 * A string URI that represents a fully-qualified file location.
 *
 * Example:
 *
 *      |      |                 |
 *      "file:///foo/bar/bird.png"
 *      |      |                 |
 *
 * NOTE:
 *   Must not containe any navigation step-up jumps ("../")
 *
 */
export const FileUri = {
  prefix: 'file',

  /**
   * Determines if the given string is a "path:" URI.
   */
  isFileUri(input?: UriString) {
    return Path.trim(input).startsWith('file:');
  },

  /**
   * Removes the "file:" prefix from the given string.
   */
  trimUriPrefix(input: string) {
    const path = Path.trim(input);
    return path ? path.replace(/^file:/, '').trim() : '';
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

    // Ensure the file-location
    input = FileUri.trimUriPrefix(input);
    if (input === '..' || input.includes('../')) return throwOrReturnInvalid();

    // NB: Defer to [PathUri] helper logic for path operations.
    const path = PathUri.path(`path:${input}`);
    if (!path) return throwOrReturnInvalid();

    return `file:${path}`;
  },
};

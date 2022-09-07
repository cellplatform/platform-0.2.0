import { Path } from '../Path/index.mjs';

type UriString = string;

/**
 * A string URI that represents a fully-qualified
 * location of a [File].
 * Example:
 *
 *      |      |                 |
 *      "file:///foo/bar/bird.png"
 *      |      |                 |
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
};

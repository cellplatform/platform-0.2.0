export const Path = {
  /**
   * Join multiple parts into a single "/" delimited path.
   * NB:
   *    This is a re-implementation of the native `join` method
   *    to allow this module to have no dependencies on platform node 'fs'.
   */
  join(...segments: string[]) {
    const parts = segments.map((part, i) => {
      const isFirst = i === 0;
      const isLast = i === segments.length - 1;
      part = isLast ? part : part.replace(/\/*$/, '');
      part = isFirst ? part : part.replace(/^\/*/, '');
      return part;
    });

    const res: string[] = [];

    // Rebuild path observing ".." level-navigation-dots.
    for (const part of parts.join('/').split('/')) {
      const trimmed = part.trim();
      if (trimmed === '.') continue;
      if (trimmed === '..') {
        if (res.length === 0) {
          break; // NB: Exit, we have "stepped up" above the root level.
        } else {
          res.pop(); // Step up a level.
          continue;
        }
      }
      res.push(part);
    }

    return res.join('/');
  },

  trim,

  /**
   * Trims slashes from the start (left) of a string.
   */
  trimSlashesStart(input: string) {
    return trim(input).replace(/^\/*/, '').trim();
  },

  /**
   * Trims slashes from the start (left) of a string.
   */
  trimSlashesEnd(input: string) {
    return trim(input).replace(/\/*$/, '').trim();
  },

  /**
   * Trims slashes from the start (left) of a string.
   */
  trimSlashes(input: string) {
    input = Path.trimSlashesStart(input);
    input = Path.trimSlashesEnd(input);
    return input;
  },

  /**
   * Ensures the path ends in a single "/".
   */
  ensureSlashEnd(input: string) {
    return `${Path.trimSlashesEnd(input)}/`;
  },

  /**
   * Remove http/https prefix.
   */
  trimHttp(input: string) {
    return trim(input)
      .replace(/^http:\/\//, '')
      .replace(/^https:\/\//, '');
  },

  /**
   * Removes a trailing `/*` wildcard glob pattern.
   */
  trimWildcardEnd(input: string) {
    let path = trim(input);
    path = path.replace(/\**$/, '');
    if (Path.trimSlashesEnd(path).endsWith('*')) {
      path = Path.trimSlashesEnd(path);
      path = Path.trimWildcardEnd(path); // <== RECURSION 🌳
    }
    return path;
  },

  /**
   * Break a path into it's constituent parts.
   */
  parts(input: string) {
    const path = (input || '').trim();

    let filename = '';
    let dir = '';
    let name = '';
    let ext = '';

    if (path) {
      const index = path.lastIndexOf('/');
      if (index > -1) {
        dir = path.substring(0, index);
        filename = path.substring(index + 1);
      } else {
        filename = path;
      }
    }

    if (filename) {
      const index = filename.lastIndexOf('.');
      if (index > -1) {
        name = filename.substring(0, index);
        ext = filename.substring(index + 1);
      } else {
        name = filename;
      }
    }

    return {
      dir, //       Directory (without trailing "/").
      filename, //  Full filename (with extension).
      name, //      Name without extension.
      ext, //       File extension.
      path, //      Complete path.
    };
  },
};

/**
 * [Helpers]
 */

function trim(input: any) {
  return typeof input === 'string' ? (input || '').trim() : '';
}

import fsextra from 'fs-extra';
import glob from 'glob';
import path from 'path';

/**
 * Node filesystem access.
 */
export const fs = {
  ...fsextra,
  ...path,
  glob(pattern: string, options: { nodir?: boolean; dot?: boolean } = {}) {
    return new Promise<string[]>((resolve, reject) => {
      glob(pattern, options, (err, matches) => (err ? reject(err) : resolve(matches)));
    });
  },
};

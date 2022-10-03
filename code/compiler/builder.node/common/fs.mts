import fsextra from 'fs-extra';
import glob from 'glob';
import path from 'path';

/**
 * Node filesystem access.
 */
export const fs = {
  ...fsextra,
  ...path,
  glob(pattern: string) {
    return new Promise<string[]>((resolve, reject) => {
      glob(pattern, (err, matches) => (err ? reject(err) : resolve(matches)));
    });
  },
};

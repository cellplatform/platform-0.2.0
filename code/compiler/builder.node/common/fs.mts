import fsextra from 'fs-extra';
import glob from 'glob';
import path from 'path';

/**
 * Node filesystem access.
 */
export const fs = {
  ...fsextra,
  ...path,
  glob,
};

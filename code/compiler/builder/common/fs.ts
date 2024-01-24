import fsextra from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

/**
 * Node filesystem access.
 */
export const fs = {
  ...fsextra,
  ...path,
  glob,
};

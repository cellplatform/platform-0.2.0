import * as t from './types.mjs';
import fsextra from 'fs-extra';
import path from 'path';

export { t };
export const fs = { ...fsextra, ...path };

/**
 * Paths
 */
import { fileURLToPath } from 'url';
const __dirname = fs.dirname(fileURLToPath(import.meta.url));
const rootDir = fs.join(__dirname, '../..');
const templateDir = fs.join(__dirname, 'tmpl');

export const Paths = {
  __dirname,
  rootDir,
  templateDir,
};

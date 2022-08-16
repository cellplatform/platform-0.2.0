#!/usr/bin/env ts-node
import path from 'path';
import { build } from 'vite';

import { Typescript } from './build.Typescript.mjs';

/**
 * Refs:
 * - https://vitejs.dev/guide/api-javascript.html#build
 */

const argv = process.argv.slice(2);
const base = argv[0] ?? '';

if (!base) {
  console.error(`ERR(Build): path to module directory required`);
  process.exit(1);
}

/**
 * Run
 */
(async () => {
  const root = path.resolve('.', base);
  await Typescript.build(root);

  await build({ root });
})();

#!/usr/bin/env ts-node
import { Typescript } from './build.Typescript.mjs';
import { Vite } from './build.Vite.mjs';

const argv = process.argv.slice(2);
const dir = argv[0] ?? '';

if (!dir) {
  console.error(`FAIL(Build): path to module directory required.`);
  process.exit(1);
}

/**
 * Run
 */
(async () => {
  const exitOnError = true;
  const silent = false;

  await Typescript.build(dir, { exitOnError });
  await Vite.build(dir, { silent });
})();

#!/usr/bin/env ts-node
import { fs, rimraf } from './common/index.mjs';

async function remove(path: string) {
  path = fs.resolve(path);
  await rimraf(path);
}

/**
 * Run
 */
(async () => {
  await remove('./node_modules');
  await remove('./yarn.lock');
})();

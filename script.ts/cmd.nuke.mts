#!/usr/bin/env ts-node
import { fs, rimraf } from './common/index.mjs';

function remove(path: string) {
  return new Promise<void>((resolve, reject) => {
    rimraf(fs.resolve(path), (err) => (err ? reject(err) : resolve()));
  });
}

/**
 * Run
 */
(async () => {
  await remove('./node_modules');
  // await remove('./yarn.lock');
})();

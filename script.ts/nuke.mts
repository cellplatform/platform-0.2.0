#!/usr/bin/env ts-node
import fspath from 'path';
import rimraf from 'rimraf';

function remove(path: string) {
  return new Promise<void>((resolve, reject) => {
    rimraf(fspath.resolve(path), (err) => (err ? reject(err) : resolve()));
  });
}

/**
 * Run
 */
(async () => {
  await remove('./node_modules');
  await remove('./yarn.lock');
})();

console.log('rimraf', rimraf);

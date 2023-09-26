#!/usr/bin/env ts-node
import { Builder, fs, pc, rimraf, Util } from './common/index.mjs';

async function remove(path: string) {
  path = fs.resolve(path);
  await rimraf(path);
}

/**
 * Modules
 */
const filter = (path: string) => {
  if (path.includes('/compiler.samples/')) return false;
  if (path.includes('/compiler.spikes/')) return false;
  return true;
};

const paths = await Builder.Find.projectDirs({ filter, sortBy: 'Alpha' });
for (const path of paths) {
  await remove(fs.join(path, 'node_modules'));
}

// Log complete clean list.
console.info();
console.info(pc.cyan('modules nuked:'));
paths.forEach((path) => console.info(pc.gray(` • ${Util.formatPath(path)}`)));
console.info();

/**
 * Mono-repo root.
 */
await remove('./node_modules');
await remove('./yarn.lock');
await remove('./pnpm-lock.yaml');

console.info(pc.cyan('root repository nuked'));

#!/usr/bin/env ts-node
import { Builder, pc, Util } from './common/index.mjs';

/**
 * Run
 */

const filter = (path: string) => true;
let paths = await Builder.findProjectDirs({ filter, sort: 'Alpha' });

if (paths.length === 0) {
  console.warn(pc.gray('no paths'));
  process.exit(1);
}

// Log complete build list.
console.log();
console.log(pc.green('clean:'));
paths.forEach((path) => console.log(pc.gray(` • ${Util.formatPath(path)}`)));
console.log();

for (const path of paths) {
  await Builder.clean(path);
}

const ok = true;
if (!ok) process.exit(1);

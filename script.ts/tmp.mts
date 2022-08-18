#!/usr/bin/env ts-node

import { fs, execa, pc } from './common/index.mjs';

export {};
console.log(123);

const path = fs.resolve('./code/builder.samples/lib-1');

console.log('path', path);

/**
 * Run
 */
(async () => {
  //
  const cwd = path;
  const { stdout } = await execa('yarn', ['test', '--watch=false'], { cwd, stdio: 'inherit' });
  console.log(stdout);

  //=> 'unicorns'
})();

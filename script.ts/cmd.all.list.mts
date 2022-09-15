#!/usr/bin/env ts-node
import { LogTable, pc, Util, Builder } from './common/index.mjs';

const filter = (path: string) => {
  if (path.includes('/code/compiler.sample')) return false;
  return true;
};
let paths = await Builder.findProjectDirs({ filter, sort: 'Alpha' });

if (paths.length === 0) {
  console.warn(pc.gray('no paths'));
  process.exit(1);
}

const table = LogTable();

for (const path of paths) {
  const column = {
    path: pc.gray(` • ${Util.formatPath(path)}`),
  };
  table.push([column.path]);
}

console.log('');
console.log(pc.green(`${paths.length} modules:`));
console.log(table.toString());
console.log('');

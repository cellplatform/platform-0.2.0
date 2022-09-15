#!/usr/bin/env ts-node
import { fs, LogTable, pc, Util, Builder, minimist } from './common/index.mjs';

const argv = minimist(process.argv.slice(2));

const filter = (path: string) => {
  if (path.includes('/code/compiler.sample')) return false;
  return true;
};
let paths = await Builder.Find.projectDirs({
  filter,
  sort: argv.topo ? 'DependencyGraph' : 'Alpha',
});

if (paths.length === 0) {
  console.warn(pc.gray('no paths'));
  process.exit(1);
}

const table = LogTable();

for (const path of paths) {
  const size = await Util.folderSize(fs.join(path, 'dist'));

  const column = {
    path: pc.gray(` • ${Util.formatPath(path)}`),
    size: pc.gray(`  /dist: ${size.toString()}`),
  };
  table.push([column.path, column.size]);
}

console.log('');
console.log(pc.green(`${paths.length} modules:`));
console.log(table.toString());
console.log('');

#!/usr/bin/env ts-node
import { Builder, LogTable, Util, fs, minimist, pc } from './common/index.mjs';

const argv = minimist(process.argv.slice(2));

const filter = (path: string) => {
  if (path.includes('/code/compiler.samples/')) return false;
  return true;
};
const sortBy = argv.topo ? 'Topological' : 'Alpha';
let paths = await Builder.Find.projectDirs({ filter, sortBy });

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

/**
 * Display output.
 */
const arrow = pc.green('↓');
const sortOrderPrint =
  sortBy === 'Alpha'
    ? ` ${arrow} sorted alphabetically (use --topo for build order)`
    : ` ${arrow} sorted topologically over the dependency graph`;

console.log('');
console.log(pc.green(`${paths.length} modules:`));
console.log(table.toString());
console.log(pc.gray(' _'));
console.info(pc.gray(sortOrderPrint));
console.log('');

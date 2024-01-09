import { Builder, pc, Util } from './common/index.mjs';

/**
 * Run
 */
const filter = (path: string) => true;
let paths = await Builder.Find.projectDirs({ filter, sortBy: 'Alpha' });

if (paths.length === 0) {
  console.warn(pc.gray('no paths'));
  process.exit(1);
}

// Log complete clean list.
console.info();
console.info(pc.cyan('clean:'));
paths.forEach((path) => console.info(pc.gray(` • ${Util.formatPath(path)}`)));
console.info();

for (const path of paths) {
  await Builder.clean(path);
}

const ok = true;
if (!ok) process.exit(1);

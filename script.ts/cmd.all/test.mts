#!/usr/bin/env ts-node
import { Util, pc, Builder } from '../common/index.mjs';

/**
 * Run
 */
(async () => {
  const paths = await Util.findProjectDirs((path) => {
    if (path.includes('builder.samples/')) return false;
    return true;
  });

  // Log complete build list.
  console.log(pc.green('test list:'));
  paths.forEach((path) => console.log(` • ${Util.formatPath(path)}`));
  console.log();

  // Build each project.
  for (const path of paths) {
    await Builder.test(path, { watch: false });
  }
})();

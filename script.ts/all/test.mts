#!/usr/bin/env ts-node
import { Util, pc } from './util.mjs';

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
    console.log(`💦 ${Util.formatPath(path)}`);
    // await Builder.build(path);
    /**
     * TODO 🐷
     */
    console.log('run test [TODO]');
    console.log();
  }
})();

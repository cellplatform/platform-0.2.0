#!/usr/bin/env ts-node
import { pc, Builder, Util } from '../common/index.mjs';

/**
 * Run
 */
(async () => {
  const paths = await Util.findProjectDirs();

  // Log complete build list.
  console.log(pc.green('build list:'));
  paths.forEach((path) => console.log(` • ${Util.formatPath(path)}`));
  console.log();

  // Build each project.
  for (const path of paths) {
    console.log(`💦 ${Util.formatPath(path)}`);
    await Builder.build(path);
  }
})();

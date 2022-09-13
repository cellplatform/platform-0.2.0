#!/usr/bin/env ts-node
import { Builder, fs, pc, Util, LogTable, Time } from './common/index.mjs';

type Milliseconds = number;

/**
 * Run
 */
(async () => {
  // type Pkg = { name: string; version: string };
  // const pkg = (await fs.readJSON(fs.resolve('./package.json'))) as Pkg;

  const filter = (path: string) => true;
  let paths = await Util.findProjectDirs({ filter, sort: 'Alpha' });
  if (paths.length === 0) return;

  // Log complete build list.
  console.log();
  console.log(pc.green('clean:'));
  paths.forEach((path) => console.log(pc.gray(` • ${Util.formatPath(path)}`)));
  console.log();

  for (const path of paths) {
    //
    await Builder.clean(path);
  }

  const ok = true;
  if (!ok) process.exit(1);
})();

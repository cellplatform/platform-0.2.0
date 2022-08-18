#!/usr/bin/env ts-node
import { Builder } from '../code/builder.node/Builder.mjs';
import pc from 'picocolors';

import { fs } from '../code/builder.node/common.mjs';

async function loadPackageJson() {
  type P = { workspaces: { packages: string[] } };
  return (await fs.readJson(fs.resolve('./package.json'))) as P;
}

async function asyncFilter<T>(list: T[], predicate: (value: T) => Promise<boolean>) {
  const results = await Promise.all(list.map(predicate));
  return list.filter((_, index) => results[index]);
}

async function findProjectDirs() {
  const pkg = await loadPackageJson();
  const paths = (
    await Promise.all(
      pkg.workspaces.packages.map((pattern) => fs.glob.find(fs.resolve(fs.join('.', pattern)))),
    )
  ).flat();

  return asyncFilter(paths, async (path) => {
    if (path.includes('/builder.node/template')) return false;
    if (!(await fs.pathExists(fs.join(path, 'package.json')))) return false;
    return true;
  });
}

/**
 * Run
 */
(async () => {
  const base = fs.resolve('.');
  const paths = await findProjectDirs();

  const formatPath = (path: string) => {
    const relative = path.substring(base.length + 1);
    const dirname = fs.basename(relative);
    const prefix = relative.substring(0, relative.length - dirname.length);
    return pc.gray(`${prefix}${pc.white(dirname)}`);
  };

  // Log complete build list.
  console.log(pc.green('build list:'));
  paths.forEach((path) => console.log(` • ${formatPath(path)}`));
  console.log();

  // Build each project.
  for (const path of paths) {
    console.log(`💦 ${formatPath(path)}`);
    await Builder.build(path);
  }
})();

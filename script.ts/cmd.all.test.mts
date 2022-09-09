#!/usr/bin/env ts-node
import { Builder, fs, pc, Util } from './common/index.mjs';

/**
 * Run
 */
(async () => {
  type Pkg = { name: string; version: string };
  const pkg = (await fs.readJSON(fs.resolve('./package.json'))) as Pkg;

  const filter = (path: string) => {
    if (path.includes('/code/samples')) return false;
    return true;
  };
  let paths = await Util.findProjectDirs({ filter });
  if (paths.length === 0) return;

  // Log complete build list.
  console.log();
  console.log(pc.green('test list:'));
  paths.forEach((path) => console.log(pc.gray(` • ${Util.formatPath(path)}`)));
  console.log();

  type E = { path: string; error: string };
  const failed: E[] = [];

  // Build each project.
  for (const path of paths) {
    try {
      await Builder.test(path, { run: true, silent: true });
    } catch (err: any) {
      failed.push({ path, error: err.message });
    }
  }
  const ok = failed.length === 0;

  const statusColor = (ok: boolean, text: string) => (ok ? pc.green(text) : pc.red(text));
  const pathOK = (path: string) => !failed.some((error) => error.path === path);
  const bullet = (path: string) => statusColor(pathOK(path), '●');

  console.log();
  console.log(statusColor(ok, ok ? 'all tests passed' : 'some failures'));
  paths.forEach((path) => console.log(` ${bullet(path)} ${Util.formatPath(path)}`));
  console.log();
  console.log(pc.gray(`platform/builder ${pc.cyan(`v${pkg.version}`)}`));

  if (!ok) process.exit(1);
})();

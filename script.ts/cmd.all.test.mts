#!/usr/bin/env ts-node
import { Builder, fs, pc, Util, Table, Time } from './common/index.mjs';

type Milliseconds = number;

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

  type R = { path: string; elapsed: Milliseconds; error?: string };
  const results: R[] = [];

  // Build each project.
  for (const path of paths) {
    const timer = Time.timer();
    try {
      await Builder.test(path, { run: true, silent: true });
      results.push({ path, elapsed: timer.elapsed.msec });
    } catch (err: any) {
      results.push({ path, elapsed: timer.elapsed.msec, error: err.message });
    }
  }
  const failed = results.filter((item) => Boolean(item.error));
  const ok = failed.length === 0;

  const statusColor = (ok: boolean, text: string) => (ok ? pc.green(text) : pc.red(text));
  const pathOK = (path: string) => !failed.some((error) => error.path === path);
  const bullet = (path: string) => statusColor(pathOK(path), '●');

  const table = Table();
  for (const result of results) {
    const path = result.path;
    const column = {
      path: pc.gray(` ${bullet(path)} ${Util.formatPath(path)}`),
      time: pc.gray(`  ${Time.duration(result.elapsed).toString()} `),
    };
    table.push([column.path, column.time]);
  }

  console.log();
  console.log(statusColor(ok, ok ? 'all tests passed' : 'some failures'));
  console.log(table.toString());
  console.log();
  console.log(pc.gray(`platform/builder ${pc.cyan(`v${pkg.version}`)}`));

  if (!ok) process.exit(1);
})();

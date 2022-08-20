#!/usr/bin/env ts-node
import { Builder, pc, Util } from './common/index.mjs';

/**
 * Run
 */
(async () => {
  const paths = await Util.findProjectDirs((path) => {
    if (path.includes('/builder.samples')) return false;
    return true;
  });
  if (paths.length === 0) return;

  // Log complete build list.
  console.log(pc.cyan('test list:'));
  paths.forEach((path) => console.log(` • ${Util.formatPath(path)}`));
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
  const bullet = (path: string) => {
    const ok = !failed.some((error) => error.path === path);
    return statusColor(ok, ok ? '✓' : '×');
  };

  console.log();
  console.log(statusColor(ok, 'results:'));
  paths.forEach((path) => console.log(` ${bullet(path)} ${Util.formatPath(path)}`));
  console.log();

  if (!ok) process.exit(1);
})();

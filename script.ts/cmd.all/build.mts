#!/usr/bin/env ts-node
import { pc, Builder, Util } from '../common/index.mjs';

/**
 * Run
 */
(async () => {
  const paths = await Util.findProjectDirs((path) => {
    if (path.includes('/builder.samples')) return false;
    return true;
  });

  // Log complete build list.
  console.log(pc.green('build list:'));
  paths.forEach((path) => console.log(` • ${Util.formatPath(path)}`));
  console.log();

  type E = { path: string; error: string };
  const failed: E[] = [];

  // Build each project.
  for (const path of paths) {
    try {
      console.log(`💦 ${Util.formatPath(path)}`);
      await Builder.build(path, { exitOnError: false });
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
  console.log(statusColor(ok, 'built:'));
  paths.forEach((path) => console.log(` ${bullet(path)} ${Util.formatPath(path)}`));
  console.log();

  if (!ok) process.exit(1);
})();

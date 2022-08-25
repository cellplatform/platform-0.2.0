#!/usr/bin/env ts-node
import { pc, Builder, Util, fs } from './common/index.mjs';

/**
 * Run
 */
(async () => {
  let paths = await Util.findProjectDirs((path) => {
    if (path.includes('/builder.samples')) return false;
    return true;
  });

  // Log complete build list.
  console.log(pc.green('build list:'));
  paths.forEach((path) => console.log(` • ${Util.formatPath(path)}`));
  console.log();

  type E = { path: string; error: string };
  const failed: E[] = [];
  const pushError = (path: string, error: string) => failed.push({ path, error });

  // Build each project.
  for (const path of paths) {
    try {
      console.log(`💦 ${Util.formatPath(path)}`);
      const res = await Builder.build(path, { exitOnError: false, silent: false });
      if (!res.ok) pushError(path, `Failed to build (${res.errorCode})`);
    } catch (err: any) {
      pushError(path, err.message);
    }
  }

  const ok = failed.length === 0;
  const statusColor = (ok: boolean, text: string) => (ok ? pc.green(text) : pc.red(text));
  const bullet = (path: string) => {
    const ok = !failed.some((error) => error.path === path);
    return statusColor(ok, ok ? '✓' : '×');
  };

  console.log(statusColor(ok, 'built:'));
  for (const path of paths) {
    const size = await Util.folderSize(fs.join(path, 'dist'));
    console.log(pc.gray(` ${bullet(path)} ${Util.formatPath(path)}  (${size.toString()})`));
  }
  console.log();

  if (!ok) process.exit(1);
})();

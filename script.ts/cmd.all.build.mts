#!/usr/bin/env ts-node
import { pc, Builder, Util, fs } from './common/index.mjs';

/**
 * Run
 */
(async () => {
  type Pkg = { name: string; version: string };
  const pkg = (await fs.readJSON(fs.resolve('./package.json'))) as Pkg;

  let paths = await Util.findProjectDirs((path) => {
    if (path.includes('/builder.samples')) return false;
    return true;
  });

  // Log complete build list.
  console.log(pc.green('build list:'));
  paths.forEach((path) => console.log(pc.gray(` • ${Util.formatPath(path)}`)));
  console.log();
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

  let totalBytes = 0;

  console.log(statusColor(ok, 'built:'));
  for (const path of paths) {
    const size = await Util.folderSize(fs.join(path, 'dist'));
    totalBytes += size.bytes;
    console.log(pc.gray(` ${bullet(path)} ${Util.formatPath(path)} (${size.toString()})`));
  }

  console.log();
  console.log(pc.gray(`${Util.filesize(totalBytes)}`));
  console.log(pc.gray(`platform/builder v${pkg.version}`));
  console.log();

  if (!ok) process.exit(1);
})();

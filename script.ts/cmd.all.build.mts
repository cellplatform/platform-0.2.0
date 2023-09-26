#!/usr/bin/env ts-node
import { Builder, LogTable, Time, Util, fs, pc } from './common/index.mjs';

type Milliseconds = number;

/**
 * Run
 */
await Builder.Dependencies.syncVersions({ save: true });
const pkg = await Builder.PackageJson.load(fs.resolve('.'));

const filter = (path: string) => {
  if (path.includes('code/spikes/dev.000')) return true;
  if (path.includes('code/spikes/slc.000')) return true;

  if (path.includes('code/compiler.samples/')) return false;
  if (path.includes('code/spikes/')) return false;
  if (path.includes('code/templates/')) return false;
  if (path.includes('_legacy')) return false;
  return true;
};
let paths = await Builder.Find.projectDirs({ filter, sortBy: 'Topological', hasViteConfig: true });

// Log module list.
console.log();
console.log(pc.cyan('Build list:'));
paths.forEach((path) => console.log(pc.gray(` • ${Util.formatPath(path)}`)));
console.log();
console.log();

type R = { path: string; elapsed: Milliseconds; error?: string };
const results: R[] = [];
const pushResult = (path: string, elapsed: Milliseconds, error?: string) => {
  results.push({ path, elapsed, error });
};

// Build each project.
for (const path of paths) {
  const timer = Time.timer();
  try {
    console.log(`💦 ${Util.formatPath(path)}`);
    const res = await Builder.build(path, { exitOnError: false, silent: false });
    const error = res.ok ? undefined : `Failed to build (${res.errorCode})`;
    pushResult(path, timer.elapsed.msec, error);
  } catch (error: any) {
    pushResult(path, timer.elapsed.msec, error.message);
  }
}

const failed = results.filter((item) => Boolean(item.error));
const ok = failed.length === 0;

const statusColor = (ok: boolean, text: string) => (ok ? pc.green(text) : pc.red(text));
const pathOK = (path: string) => !failed.some((error) => error.path === path);
const bullet = (path: string) => statusColor(pathOK(path), '●');

let totalBytes = 0;
const table = LogTable();
for (const result of results) {
  const path = result.path;
  const ok = pathOK(path);
  const size = await Util.folderSize(fs.join(path, 'dist'));
  const formattedPath = Util.formatPath(path, { filenameColor: ok ? pc.white : pc.red });
  const column = {
    path: pc.gray(` ${bullet(path)} ${formattedPath}`),
    size: pc.gray(`  /dist: ${size.bytes === 0 ? '-' : Util.filesize(size.bytes)}`),
    time: pc.gray(`   ${Time.duration(result.elapsed).toString()} `),
  };
  totalBytes += size.bytes;
  table.push([column.path, column.size, column.time]);
}

console.log('');
console.log(statusColor(ok, ok ? 'built:' : 'built (with failures):'));
console.log(table.toString());
console.log('');
console.log(pc.gray(`${Util.filesize(totalBytes)}`));
console.log(pc.gray(`platform/builder ${pc.cyan(`v${pkg.version}`)}`));
console.log('');

if (!ok) process.exit(1);

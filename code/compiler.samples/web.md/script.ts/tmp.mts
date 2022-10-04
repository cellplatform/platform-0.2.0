#!/usr/bin/env ts-node
import { rx } from 'sys.util';
import { Filesystem, NodeFs } from 'sys.fs.node';
import { Vercel } from 'cloud.vercel';
import { t } from '../src/common/index.mjs';
import { Pkg } from '../src/index.pkg.mjs';

const token = process.env.VERCEL_TEST_TOKEN || ''; // Secure API token (secret).
const bus = rx.bus();

/**
 * Initialize filesystem access.
 */
const sourceDir = NodeFs.resolve('../../../../../live-state/tdb.meeting/undp');
const tmpDir = NodeFs.resolve('./tmp');
const FsSource = await Filesystem.client(sourceDir, { bus });
const FsTmp = await Filesystem.client(tmpDir, { bus });

const fs = {
  source: FsSource.fs,
  tmp: FsTmp.fs,
};

const logFsInfo = async (title: string, fs: t.Fs) => {
  const m = await fs.manifest();
  const paths = m.files.map((m) => m.path);
  console.info(``);
  console.info(`💦`);
  console.info(`  filesystem:`, title);
  console.info('  paths:', paths);
};

await logFsInfo('source', fs.source);
await logFsInfo('tmp (local)', fs.tmp);

/**
 * Read in the source markdown.
 */

/**
 * Copy source content (local)
 */
const source = await fs.source.manifest();
for (const file of source.files) {
  const path = fs.source.join('dist', file.path);
  const data = await fs.source.read(file.path);
  await fs.tmp.write(path, data);
}

/**
 * Deploy
 */
const vercel = Vercel.client({ bus, token, fs: fs.tmp });
//
await vercel.deploy({
  team: 'tdb',
  name: `tdb.undp.v${Pkg.version}`,
  project: 'tdb-undp',
  source: 'dist',
  alias: 'undp.db.team',
  ensureProject: true,
  regions: ['sfo1'],
  target: 'production', // NB: required to be "production" for the DNS alias to be applied.
  silent: false, // Standard BEFORE and AFTER deploy logging to console.
});

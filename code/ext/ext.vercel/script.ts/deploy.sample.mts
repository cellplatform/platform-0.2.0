#!/usr/bin/env ts-node
import { Vercel } from 'ext.vercel';
import { Filesystem } from 'sys.fs.node';
import { Time, rx } from 'sys.util';

import { Util } from './common.mjs';

const token = process.env.VERCEL_TEST_TOKEN || ''; // Secure API token (secret).
const bus = rx.bus();

/**
 * 🧠 SYSTEM: Filesystem
 */
const dir = process.cwd(); // READ/WRITE "scope" (security constraint).
const { fs } = await Filesystem.client(dir, { bus }); // <═══╗
//                                                           ║
//                                            SHARED EventBus 🌳

const now = Time.now.format('hh:mm');
console.info('now:', now);

/**
 * Copy source content (local)
 */
await fs.delete('tmp');
const copy = async (sourceDir: string) => Util.copy(fs, sourceDir, 'tmp/dist');

await fs.write('tmp/dist/index.html', `<h1>Hello World - ${now}</h1>\n`);
// await copy('../../compiler.samples/web.react/dist');
// await copy('../../compiler.samples/web.svelte/dist');
// await copy('../../tmp/phil.cockfield.net/dist');

/**
 * 🧠 VENDOR: The Vercel API "wrapper"
 *            (entry point)
 */
const vercel = Vercel.client({ bus, fs, token }); // <═══╗
//                                                       ║
//                                        SHARED EventBus 🌳

await vercel.deploy({
  name: 'my-tmp',
  source: 'tmp/dist',
  team: 'tdb',
  project: 'tdb-tmp',
  alias: 'tmp.db.team',
  ensureProject: true,
  regions: ['sfo1'],
  target: 'production', // NB: required to be "production" for the DNS alias to be applied.
  silent: false, // Standard BEFORE and AFTER deploy logging to console.
});

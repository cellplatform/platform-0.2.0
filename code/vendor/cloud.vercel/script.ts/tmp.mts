#!/usr/bin/env ts-node
import { Filesystem } from 'sys.fs.node';
import { Time } from 'sys.util';
import { rx, Vercel } from 'cloud.vercel';

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
console.log('now:', now);

await fs.delete('tmp');
await fs.write('tmp/dist/index.html', `<h1>Hello World - ${now}</h1>\n`);

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
  ensureProject: true,
  regions: ['sfo1'],
  alias: 'tmp.db.team',
  target: 'production', // NB: required to be "production" for the DNS alias to be applied.
  silent: false, // Standard BEFORE and AFTER deploy logging to console.
});

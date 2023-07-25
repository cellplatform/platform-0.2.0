/**
 * Sample (Web/Browser)
 */
import { Filesystem } from 'sys.fs.indexeddb';
import { Time } from 'sys.util';
import { rx, Vercel } from '../index.mjs';

import { Pkg } from '../index.pkg.mjs';

console.info(Pkg.toString());
console.info('');

/**
 * TOKEN: for testing, create a [.env.local] file
 *        with sample API token, eg:
 *
 *               VITE_VERCEL_TEST_TOKEN="<< secret >>"
 *
 *       (CAREFUL: make sure to never ever let a secret get checked-in to the repo).
 */
const token = (import.meta as any).env.VITE_VERCEL_TEST_TOKEN;

/**
 * The shared event-bus.
 */
const bus = rx.bus();

/**
 * 🧠 SYSTEM: Filesystem
 */
const { fs } = await Filesystem.client({ bus }); // <═══╗
//                                                      ║
//                                           SHARED EventBus 🌳

console.info('fs (filesystem):', fs);

/**
 * 🧠 VENDOR: The Vercel API "wrapper"
 *            (entry point)
 */
const vercel = Vercel.client({ bus, fs, token }); // <═══╗
//                                                       ║
//                                        SHARED EventBus 🌳

console.info('vercel (client):', vercel);

const now = Time.now.format('hh:mm');
const content = `<h1>Hello World - ${now}</h1>`;

console.info('');
console.info(`     content: "${content}"`);
console.info('');

await fs.delete('tmp');
await fs.write('tmp/dist/index.html', `${content}\n`);

const m = await fs.manifest();
console.log('filesystem manifest:', m);

(window as any).vercel = {
  /**
   * Invoke the deploy
   */
  async deploy() {
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
  },
};

console.info(`HINT: Use the test [vercel] object from the command-line to perform a sample deploy`);
console.info(`eg:   > vercel.deploy()`);
console.info('');

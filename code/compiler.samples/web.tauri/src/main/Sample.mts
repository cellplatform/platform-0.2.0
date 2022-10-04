import * as fs from '@tauri-apps/api/fs';
import { Filesystem as FSIndexedDB } from 'sys.fs.indexeddb';
import { Vercel } from 'cloud.vercel';

import { rx } from 'sys.util';
import { t } from '../common/index.mjs';
import { Pkg } from '../index.pkg.mjs';

/**
 * Tauri Filesystem
 */
export const Sample = {
  /**
   * 🐷 TEMP 🐷
   *  Sample filesystem interactions
   */
  async tauriFs() {
    // TEMP 🐷
    const dir = fs.BaseDirectory.Document;
    const recursive = true;

    await fs.createDir('A1/foo', { dir, recursive });
    await fs.createDir('A1/bar', { dir, recursive });

    const file = new TextEncoder().encode('Hello World');
    await fs.writeBinaryFile('A1/foo/file.crdt', file, { dir });

    const readDir = await fs.readDir('A1', { dir, recursive });

    console.log('-----------------------------------');
    console.log('fs.readDir:', readDir);
  },

  /**
   * Initialize an IndexedDB filesystem
   */
  async IndexedDbFilesystem(options: { bus?: t.EventBus<any> } = {}) {
    const { bus } = options;
    const store = await FSIndexedDB.client({ bus });
    return store.fs;
  },

  /**
   * TMP
   */
  async tmp() {
    const bus = rx.bus();
    const store = await FSIndexedDB.client({ bus });
    const fs = store.fs;

    await fs.write('dist/index.md', '# Hello World!\n');
    console.log('manifest:', await fs.manifest());

    const info = await fs.info('dist');
    console.log('info', info);
  },

  /**
   * Sample deploy
   */
  async tmpDeploy(options: { fs?: t.Fs; bus?: t.EventBus<any> } = {}) {
    const bus = options.bus ?? rx.bus();
    const fs = options.fs ?? (await Sample.IndexedDbFilesystem());

    const token = '...'; // TEMP 🐷
    const vercel = Vercel.client({ bus, token, fs });

    console.log('------------------------------------------///-');
    console.log('token', token);
    console.log('manifet', await fs.manifest({ dir: 'dist' }));

    const info = await fs.info('/dist');
    console.log('info', info);

    const res = await vercel.deploy({
      team: 'tdb',
      name: `tdb.tmp.v${Pkg.version}`,
      project: 'tdb-tmp',
      source: 'dist',
      alias: 'tmp.db.team',
      ensureProject: true,
      regions: ['sfo1'],
      target: 'production', // NB: required to be "production" for the DNS alias to be applied.
      silent: false, // Standard BEFORE and AFTER deploy logging to console.
    });

    console.log('res', res);
  },
};

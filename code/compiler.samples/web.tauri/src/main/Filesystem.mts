import * as fs from '@tauri-apps/api/fs';
import { Filesystem as FSIndexedDB } from 'sys.fs.indexeddb';

import { rx } from 'sys.util';
import { t } from '../common/index.mjs';

/**
 * Tauri Filesystem
 */
export const Filesystem = {
  /**
   * 🐷 TEMP 🐷
   *  Sample filesystem interactions
   */
  async tmpSample() {
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
  async indexedDb(options: { bus?: t.EventBus<any> } = {}) {
    //
    const { bus } = options;
    // const bus = options.bus ?? rx.bus();
    console.log('indexedDb');
    const store = await FSIndexedDB.client({ bus });
    return store;
  },
};

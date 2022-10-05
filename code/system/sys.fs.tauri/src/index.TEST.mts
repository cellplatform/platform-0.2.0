import { TestTauri, describe, expect, it, Pkg } from './test/index.mjs';

import * as tfs from '@tauri-apps/api/fs';

// import { mockIPC } from '@tauri-apps/api/mocks';

describe('main', () => {
  it('temp 🐷', () => {
    expect(Pkg.version.length).to.greaterThan(0);
  });

  it('Mock Tauri: "Filesystem" (message interception)', async () => {
    const dir = tfs.BaseDirectory.Document;
    const recursive = true;

    TestTauri.mockIPC(async (cmd, args) => {
      console.log('cmd', cmd);
      console.log('args', args);
    });

    await tfs.createDir('A1/foo', { dir, recursive });

    console.log('-----------------------------------------');

    // mocks.mockWindows

    /**
     * TODO 🐷
     *
     * - Map "t.FS" primitives the required an in-memory file-system.
     * - Map what is required for the FS driver.
     * - Driver
     *    |- IO:
     *          - read
     *          - write
     *          - copy
     *          - move
     *          - delete
     *
     *    |- Indexer
     *          - tauri.fs.readdir
     *
     */
  });
});

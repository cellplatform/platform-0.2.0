import { TestTauri, describe, expect, it, Pkg, TestFilesystem } from './test';

import * as tfs from '@tauri-apps/api/fs';

describe('main', () => {
  it('temp 🐷', () => {
    expect(Pkg.version.length).to.greaterThan(0);
  });

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
  it('Mock Tauri: "Filesystem" (message interception)', async () => {
    const dir = tfs.BaseDirectory.Document;
    const recursive = true;

    const { fs } = TestFilesystem.memory();

    TestTauri.mockIPC(async (cmd, args) => {
      console.log('cmd', cmd);
      console.log('args', args);

      const path = (args.message as any).path;
      console.log('path', path);
      const p = fs.join(path, 'file.tmp');
      await fs.write(p, 'Hello World!'); // TEMP 🐷
    });

    await tfs.createDir('A1/foo', { dir, recursive });

    console.log('---------------------------------------');
    console.log('await fs.manifest()', await fs.manifest());
  });
});

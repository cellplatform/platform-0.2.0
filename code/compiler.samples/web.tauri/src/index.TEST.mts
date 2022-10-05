import { describe, expect, it, Pkg, TestTauri} from './test/index.mjs';

import * as fs from '@tauri-apps/api/fs';
import { mockIPC } from '@tauri-apps/api/mocks';
import { Time } from './common/index.mjs';

describe('main', () => {
  it('tmp', () => {
    expect(Pkg.version.length).to.greaterThan(0);
  });

  it('tmp', async () => {
    const dir = fs.BaseDirectory.Document;
    const recursive = true;

    mockIPC(async (cmd, args) => {
      console.log('cmd', cmd);
      console.log('args', args);
    });

    await fs.createDir('A1/foo', { dir, recursive });

    console.log('-------------------------------------------');
    console.log('done');
    // mocks.mockWindows
  });
});

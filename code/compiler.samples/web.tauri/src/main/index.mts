import { getVersion } from '@tauri-apps/api/app';
import { appWindow } from '@tauri-apps/api/window';
import * as fs from '@tauri-apps/api/fs';

(async () => {
  const version = await getVersion();
  appWindow.setTitle(`A1 - ${version}`);

  /**
   * Filesystem (samples)
   */
  const dir = fs.BaseDirectory.Document;
  const recursive = true;

  await fs.createDir('A1/foo', { dir, recursive });
  await fs.createDir('A1/bar', { dir, recursive });

  const file = new TextEncoder().encode('Hello World');
  await fs.writeBinaryFile('A1/foo/file.dat', file, { dir });

  const readDir = await fs.readDir('A1', { dir, recursive });
  console.log('-----------------------------------');
  console.log('fs.readDir:', readDir);
})();

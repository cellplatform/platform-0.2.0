import { getVersion } from '@tauri-apps/api/app';
import { appWindow } from '@tauri-apps/api/window';
import { Sample } from './Sample.mjs';
import { rx } from '../common/index.mjs';

// import('./worker.main.mjs');

(async () => {
  const version = await getVersion();
  appWindow.setTitle(`A1 - ${version}`);
})();

/**
 * IndexedDB
 */
(async () => {
  console.log('-------------------------------------------');
  const bus = rx.bus();

  const fs = await Sample.IndexedDbFilesystem({ bus });
  // console.log('m', m);
  // console.log('IndexedDB', window.indexedDB);
  // const f = await fs.manifest();
  // console.log('f', f);

  const path = 'dist/index.md';

  await fs.write(path, '# Hello\n');

  const e = await fs.exists(path);
  console.log(path, e);

  const m = await fs.manifest();
  console.log('m', m);
})();

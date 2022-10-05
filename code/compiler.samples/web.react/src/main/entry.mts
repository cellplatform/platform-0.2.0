import('./worker.main.mjs');

import { Filesystem, rx } from 'sys.fs.indexeddb';

/**
 * TODO 🐷
 */
(async () => {
  const bus = rx.bus();
  const store = await Filesystem.client({ bus });
  const fs = store.fs;

  await fs.write('dist/index.md', '# Hello World!\n');
  console.log('manifest:', await fs.manifest());
  console.log('info - /dist:', await fs.info('/dist'));
})();

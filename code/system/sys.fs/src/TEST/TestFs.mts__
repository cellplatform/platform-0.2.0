import { FsIndexerLocal, FsDriverLocal } from '@platform/cell.fs.local';
import { fs } from '@platform/fs';

import { Hash } from '../web/common';

const tmp = fs.resolve('tmp');

export const TestFs = {
  FsDriverLocal,
  FsIndexerLocal,

  tmp,

  node: fs,
  driver: FsDriverLocal({ dir: fs.join(tmp, 'local.root'), fs }),
  index: (dir: string) => FsIndexerLocal({ dir, fs }),

  async reset() {
    await fs.remove(TestFs.driver.dir);
  },

  join: fs.join,
  resolve: fs.resolve,
  exists: fs.pathExists,

  async readFile(path: string) {
    path = fs.resolve(path);
    const file = await fs.readFile(path);
    const data = new Uint8Array(file.buffer);
    const hash = Hash.sha256(data);
    return { path, data, hash };
  },
};

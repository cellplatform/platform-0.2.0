import { IndexedDbDriver as IndexedDb } from './IndexedDb.Fs.Driver/index.mjs';
import { Path, Filesize, Bus } from 'sys.fs';

export const Filesystem = {
  Bus,
  Path,
  Filesize,
  Driver: { kind: 'IndexedDb', IndexedDb },
};

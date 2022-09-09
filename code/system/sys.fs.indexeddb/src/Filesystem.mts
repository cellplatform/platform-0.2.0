import { FsIndexedDbDriver as IndexedDb } from './Fs.IndexedDb.Driver/index.mjs';
import { Path, Filesize, BusController, BusEvents } from 'sys.fs';

export const Filesystem = {
  Path,
  Filesize,
  Driver: {
    kind: 'IndexedDb',
    IndexedDb,
    BusController,
    BusEvents,
  },
};

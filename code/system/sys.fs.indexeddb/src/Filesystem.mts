import { FsIndexedDb as IndexedDb } from './Fs.IndexedDb/index.mjs';
import { Path, Filesize, BusController, BusEvents } from 'sys.fs';

export const Filesystem = {
  Path,
  Filesize,
  driver: {
    kind: 'IndexedDb',
    IndexedDb,
    BusController,
    BusEvents,
  },
};

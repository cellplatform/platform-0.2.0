import { FsIndexedDb as IndexedDb } from './FsIndexedDb/index.mjs';
import { Path, Filesize, BusController, BusEvents } from 'sys.fs';

export const Filesystem = {
  kind: 'IndexedDb',
  Path,
  Filesize,
  BusController,
  BusEvents,
  IndexedDb,
};

import { rx, slug, t } from './common/index.mjs';
import { IndexedDbDriver, IndexedDbDriver as IndexedDb } from './IndexedDb.Fs.Driver/index.mjs';
import { Path, Filesize, Bus } from 'sys.fs';

type FilesystemId = string;
type DirPath = string;

export const Filesystem = {
  Bus,
  Path,
  Filesize,
  Driver: { kind: 'IndexedDb', IndexedDb },

  /**
   * Initialize an event-bus driven client API
   * to the node filesystem.
   */
  async client(
    options: {
      dir?: DirPath;
      bus?: t.EventBus;
      id?: FilesystemId;
      dispose$?: t.Observable<any>;
    } = {},
  ) {
    const { bus = rx.bus(), id = `fs.indexeddb.${slug()}`, dir, dispose$ } = options;
    const driver = (await IndexedDbDriver({ dir })).driver;
    const controller = Bus.Controller({ bus, id, driver, dispose$ });
    const { events, dispose } = controller;
    const fs = events.fs();
    const ready = await events.ready();
    if (ready.error) throw new Error(ready.error.message);
    return { fs, bus, events, dispose };
  },
};

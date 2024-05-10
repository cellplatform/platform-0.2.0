import { rx, slug, t } from './common';
import { IndexedDbDriver as IndexedDb } from './IndexedDb.Fs.Driver';
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
   * to the IndexedDB filesystem.
   */
  async client(
    options: {
      id?: FilesystemId;
      bus?: t.EventBus;
      dir?: DirPath;
      dispose$?: t.Observable<any>;
    } = {},
  ) {
    const { bus = rx.bus(), dir, dispose$ } = options;
    const driver = (await IndexedDb({ dir, id: options.id })).driver;

    const id = `fs.indexeddb.${slug()}`;
    const controller = Bus.Controller({ id, bus, driver, dispose$ });
    const { events, dispose } = controller;
    const fs = events.fs();

    const ready = await events.ready();
    if (ready.error) throw new Error(ready.error.message);

    return {
      fs,
      bus,
      events,
      dispose,
    };
  },
} as const;

import { t, slug, rx } from './common';
import { Path, Filesize, Bus } from 'sys.fs';
import { NodeDriver, NodeDriver as Node } from './Node.Fs.Driver';

export { Path, Filesize, MemoryMock } from 'sys.fs';

type FilesystemId = string;
type DirPath = string;

export const Filesystem = {
  Bus,
  Path,
  Filesize,
  Driver: { kind: 'Node', Node },

  /**
   * Initialize an event-bus driven client API
   * to the node filesystem.
   */
  async client(
    dir: DirPath,
    options: { bus?: t.EventBus; id?: FilesystemId; dispose$?: t.Observable<any> } = {},
  ) {
    const { bus = rx.bus(), id = `fs.node.${slug()}`, dispose$ } = options;
    const driver = NodeDriver({ dir });
    const controller = Bus.Controller({ bus, id, driver, dispose$ });
    const { events, dispose } = controller;
    const fs = events.fs();
    const ready = await events.ready();
    if (ready.error) throw new Error(ready.error.message);
    return { fs, bus, events, dispose } as const;
  },
} as const;

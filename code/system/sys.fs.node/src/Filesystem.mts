import { t, slug, rx } from './common/index.mjs';
import { Path, Filesize, Bus } from 'sys.fs';
import { NodeDriver as Node } from './Node.Fs.Driver/index.mjs';

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
  async client(dir: DirPath, options: { bus?: t.EventBus; id?: FilesystemId } = {}) {
    const { bus = rx.bus(), id = `fs.node.${slug()}` } = options;
    const controller = Bus.Controller({ bus, id, driver: Node({ dir }) });
    const { events, dispose } = controller;
    const fs = events.fs();
    const ready = await events.ready();
    if (ready.error) throw new Error(ready.error.message);
    return { fs, bus, events, dispose };
  },
};

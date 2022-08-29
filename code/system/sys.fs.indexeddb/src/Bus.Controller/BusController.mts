import { BusControllerIndexer } from './BusController.Indexer.mjs';
import { BusControllerIo } from './BusController.Io.mjs';
import { BusEvents, rx, t, DEFAULT } from './common.mjs';
import { BusControllerChange } from './BusController.Change.mjs';

type FilesystemId = string;
type Milliseconds = number;

/**
 * Event controller (web).
 */
export function BusController(args: {
  bus: t.EventBus<any>;
  id?: FilesystemId;
  driver: t.FsDriverLocal;
  index: t.FsIndexer;
  filter?: (e: t.SysFsEvent) => boolean;
  timeout?: Milliseconds;
}): t.SysFsController {
  const { driver, index, timeout } = args;
  const fs = driver;
  const id = (args.id || '').trim() || DEFAULT.FILESYSTEM_ID;

  const bus = rx.busAsType<t.SysFsEvent>(args.bus);
  const events = BusEvents({ id, bus, timeout, filter: args.filter });
  const { dispose, dispose$ } = events;

  /**
   * Sub-controllers.
   */
  BusControllerIo({ id, fs, bus, events });
  BusControllerIndexer({ id, fs, bus, events, index });
  BusControllerChange({ id, fs, bus, events });

  /**
   * API
   */
  const dir = driver.dir;
  return {
    id,
    dir,
    dispose,
    dispose$,
    events,
    fs: events.fs,
  };
}

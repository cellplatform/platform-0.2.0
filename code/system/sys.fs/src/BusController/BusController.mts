import { BusControllerChange } from './BusController.Change.mjs';
import { BusControllerIndexer } from './BusController.Indexer.mjs';
import { BusControllerIo } from './BusController.Io.mjs';
import { BusEvents, DEFAULT, Path, rx, t } from './common';

type FilesystemId = string;
type Milliseconds = number;

/**
 * Event controller (web).
 */
export function BusController(args: {
  bus: t.EventBus<any>;
  driver: t.FsDriver;
  id?: FilesystemId;
  filter?: (e: t.FsBusEvent) => boolean;
  timeout?: Milliseconds;
  dispose$?: t.Observable<any>;
}): t.SysFsController {
  const { driver, timeout, filter } = args;
  const { io } = driver;

  const id = (args.id || '').trim() || DEFAULT.FILESYSTEM_ID;
  const dir = Path.ensureSlashStart(driver.io.dir);

  const bus = rx.busAsType<t.FsBusEvent>(args.bus);
  const events = BusEvents({ id, bus, timeout, filter, dispose$: args.dispose$ });
  const { fs, dispose, dispose$ } = events;

  /**
   * Sub-controllers.
   */
  BusControllerIo({ id, bus, io, events });
  BusControllerIndexer({ id, bus, driver, events });
  BusControllerChange({ id, bus, events });

  /**
   * API
   */
  return { id, fs, dir, events, dispose, dispose$ } as const;
}

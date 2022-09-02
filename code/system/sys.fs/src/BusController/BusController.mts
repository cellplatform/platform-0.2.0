import { BusControllerChange } from './BusController.Change.mjs';
import { BusControllerIndexer } from './BusController.Indexer.mjs';
import { BusControllerIo } from './BusController.Io.mjs';
import { BusEvents, DEFAULT, Path, rx, t } from './common.mjs';

type FilesystemId = string;
type Milliseconds = number;

/**
 * Event controller (web).
 */
export function BusController(args: {
  bus: t.EventBus<any>;
  driver: t.FsDriver;
  indexer: t.FsIndexer;
  id?: FilesystemId;
  filter?: (e: t.FsBusEvent) => boolean;
  timeout?: Milliseconds;
}): t.SysFsController {
  const { driver, indexer, timeout, filter } = args;
  const id = (args.id || '').trim() || DEFAULT.FILESYSTEM_ID;
  const dir = Path.ensureSlashStart(driver.dir);

  const bus = rx.busAsType<t.FsBusEvent>(args.bus);
  const events = BusEvents({ id, bus, timeout, filter });
  const { fs, dispose, dispose$ } = events;

  /**
   * Sub-controllers.
   */
  BusControllerIo({ id, bus, driver, events });
  BusControllerIndexer({ id, bus, driver, indexer, events });
  BusControllerChange({ id, bus, events });

  /**
   * API
   */
  return { id, fs, dir, events, dispose, dispose$ };
}

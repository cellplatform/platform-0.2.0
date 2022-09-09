import { rx, slug, t } from './common/index.mjs';
import { Filesystem } from './Filesystem.mjs';
import { MemoryMock } from './MemoryMock/index.mjs';

type FilesystemId = string;
type DirPathString = string;

/**
 * Common setup for tests that interact with a filesystem.
 */
export const TestFilesystem = {
  MemoryMock,
  randomFile: MemoryMock.randomFile,

  /**
   * A test filesystem backed my an in-memory shim.
   */
  memory(options: { bus?: t.EventBus; id?: FilesystemId; dir?: DirPathString } = {}) {
    const { bus = rx.bus(), id = `foo.${slug()}` } = options;
    const driver = MemoryMock.create().driver;
    const controller = Filesystem.BusController({ id, bus, driver });
    const { events, dispose } = controller;
    const fs = events.fs(options.dir);
    return { bus, driver, fs, events, dispose };
  },
};

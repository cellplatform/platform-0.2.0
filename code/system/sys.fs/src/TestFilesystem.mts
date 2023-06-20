import { rx, slug, type t } from './common';
import { Filesystem } from './Filesystem.mjs';
import { MemoryMock } from './MemoryMock';

type DirPath = string;

/**
 * Common setup for tests that interact with a filesystem.
 */
export const TestFilesystem = {
  MemoryMock,
  randomFile: MemoryMock.randomFile,

  /**
   * A test filesystem backed my an in-memory shim.
   */
  memory(
    options: {
      dir?: DirPath;
      bus?: t.EventBus<any>;
      dispose$?: t.Observable<any>;
    } = {},
  ) {
    const { bus = rx.bus(), dir, dispose$ } = options;
    const driver = MemoryMock.create().driver;

    const id = `fs.memory.${slug()}`;
    const controller = Filesystem.Bus.Controller({ id, bus, driver, dispose$ });
    const { events, dispose } = controller;

    const fs = events.fs(dir);
    return { bus, driver, fs, events, dispose } as const;
  },
} as const;

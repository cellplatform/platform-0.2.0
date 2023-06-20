import { TestFilesystem as Base } from 'sys.fs';
import { rx, Is, type t } from './common';
import { Filesystem } from './Filesystem.mjs';

/**
 * Common setup for tests that interact with a filesystem.
 */
export const TestFilesystem = {
  ...Base,

  /**
   * Retrieve a test file-system (safe to run on node AND/OR browser).
   */
  async client(eventbus?: t.EventBus<any>) {
    const bus = eventbus ?? rx.bus();

    // NodeJS (UI tests running in CI)
    if (Is.env.nodejs) return Base.memory({ bus });

    // Browser.
    const id = 'fs.dev';
    return await Filesystem.client({ bus, id });
  },
} as const;

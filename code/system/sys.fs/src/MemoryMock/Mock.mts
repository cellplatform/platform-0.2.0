import { FsMockIO as IO } from './Mock.IO.mjs';
import { FsMockIndexer as Indexer } from './Mock.Indexer.mjs';
import { DEFAULT, type t } from './common.mjs';
import { randomFile } from './util.mjs';

import type { GetStateMap } from './MockState.mjs';

/**
 * FUNCTIONAL SPECIFICATION
 *
 *    (abstract <Mock> in-memory implementation)
 *
 *    Mocks the main pieces of an abstract <FileSystem> implementation
 *    in a lightweight, state-less in-memory mock.
 *
 *    This can be used as a testing shim.
 *
 *    This API implementation of the <t.Fs> type structure is to be treated
 *    as the "working behavioral" specification of what ideas designed into
 *    the <t.FS> type declarations.
 *
 *    Implementations of file-system <Drivers> and <Indexers> must
 *    pass equivalent test-suites of the logical-components in this,
 *    the [sys.fs] module, which use the <MemoryMock> for it's
 *    injected implementation in unit-tests (aka. a "functional shim").
 *
 *    🌳
 *    See the "functional specification" test suite within [sys.fs.spec].
 */
export const MemoryMock = {
  DEFAULT,
  IO,
  Indexer,
  randomFile,

  create(dir?: string) {
    const getState: GetStateMap = () => mocks.io.getState();

    const mocks = {
      io: IO({ dir }),
      indexer: Indexer({ dir, getState }),
    } as const;

    const driver: t.FsDriver = {
      io: mocks.io.driver,
      indexer: mocks.indexer.driver,
    } as const;

    return { driver, mocks } as const;
  },
} as const;

import { FsMockDriverIO as IO } from './Mock.DriverIO.mjs';
import { FsMockIndexer as Indexer } from './Mock.Indexer.mjs';
import { randomFile } from './util.mjs';
import { t, DEFAULT } from './common.mjs';

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

  create(dir?: string): t.FsDriver {
    const { io, getState } = IO({ dir });
    const { indexer } = Indexer({ dir, getState });
    return { io, indexer };
  },
};

import { FsMockDriver } from './Mock.Driver.mjs';
import { FsMockIndexer } from './Mock.Indexer.mjs';
import { randomFile } from './util.mjs';
export { DEFAULT } from './common.mjs';

export { FsMockDriver, FsMockIndexer };

/**
 * SPECIFICATION
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
 */
export const MemoryMock = {
  Driver: FsMockDriver,
  Indexer: FsMockIndexer,
  randomFile,
};

export default MemoryMock;

export type * from './t.Automerge';

/**
 * @external
 */
export type { next as A, Patch, PatchInfo } from '@automerge/automerge';
export type {
  AutomergeUrl,
  DocHandle,
  NetworkAdapter,
  Repo,
  StorageAdapter,
} from '@automerge/automerge-repo';
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type { JsonPath, PatchState } from 'sys.data.json/src/types';
export type { SpecImport, TestSuiteRunResponse } from 'sys.test.spec/src/types';
export type {
  CBOR,
  Disposable,
  EventBus,
  IODirection,
  Immutable,
  ImmutableChange,
  ImmutableNext,
  ImmutableRef,
  Lifecycle,
  Msecs,
  UntilObservable,
} from 'sys.types/src/types';

/**
 * @local
 */
export type * from '../types';

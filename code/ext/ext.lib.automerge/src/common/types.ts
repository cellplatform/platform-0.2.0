/**
 * @external
 */
export type { next as A, Patch, PatchInfo } from '@automerge/automerge';
export type {
  AutomergeUrl,
  DocHandle,
  NetworkSubsystem,
  Repo,
  StorageSubsystem,
} from '@automerge/automerge-repo';
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type { SpecImport, TestSuiteRunResponse } from 'sys.test.spec/src/types.mjs';
export type { Disposable, EventBus, Lifecycle } from 'sys.types/src/types.mjs';

/**
 * @local
 */
export type * from '../types';

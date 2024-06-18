/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type {
  Disposable,
  Error,
  EventBus,
  ImmutableEvents,
  ImmutableRef,
  Lifecycle,
  Msecs,
  ObjectPath,
  UntilObservable,
} from 'sys.types/src/types';

export type { SpecImport, SpecImports, TestSuiteRunResponse } from 'sys.test.spec/src/types';
export type { Describe, Expect, It } from 'sys.test/src/types';
export type { PatchOperation } from 'sys.util/src/types';

/**
 * @local
 */
export type * from '../types';

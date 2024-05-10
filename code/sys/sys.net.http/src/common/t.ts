/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type {
  Disposable,
  EventBus,
  Json,
  Lifecycle,
  Msecs,
  PortNumber,
  UntilObservable,
} from 'sys.types/src/types';

export type { SpecImport, SpecImports, TestSuiteRunResponse } from 'sys.test.spec/src/types';

/**
 * @local
 */
export type * from '../types';

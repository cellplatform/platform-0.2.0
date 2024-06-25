/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type {
  Disposable,
  Event,
  EventBus,
  IgnoredResponse,
  Immutable,
  ImmutableMutator,
  ImmutableRef,
  Json,
  JsonMap,
  Lifecycle,
  Msecs,
  UntilObservable,
} from 'sys.types/src/types';

export type {
  BundleImport,
  SpecImports,
  TestHandlerArgs,
  TestModel,
  TestSuiteModel,
  TestSuiteRunResponse,
} from 'sys.test.spec/src/types';

export type { CssValue } from 'sys.ui.react.css/src/types';

/**
 * @local
 */
export type * from './index';

export type UrlString = string;
export type UrlInput = string | URL | Location;

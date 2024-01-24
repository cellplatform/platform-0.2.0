/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type {
  EventBus,
  Event,
  Disposable,
  Json,
  JsonMap,
  IgnoredResponse,
} from 'sys.types/src/types';

export type {
  TestModel,
  TestSuiteModel,
  BundleImport,
  TestSuiteRunResponse,
  TestHandlerArgs,
  SpecImports,
} from 'sys.test.spec/src/types.mjs';

export type { CssValue } from 'sys.ui.react.css/src/types';

/**
 * @local
 */
export type * from './index';

export type UrlString = string;
export type UrlInput = string | URL | Location;

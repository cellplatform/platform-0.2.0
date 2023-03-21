/**
 * @external
 */
export type { Observable } from 'rxjs';
export type { IconType } from 'react-icons';

/**
 * @system
 */
export * from 'sys.ui.react.dev.types/src/types.mjs';

export type {
  EventBus,
  Event,
  Disposable,
  Json,
  JsonMap,
  IgnoredResponse,
  DomRect,
} from 'sys.types/src/types.mjs';

export type { CssValue } from 'sys.ui.react.css/src/types.mjs';

export type {
  TestModel,
  TestHandlerArgs,
  TestSuiteRunResponse,
  SpecImport,
  SpecImports,
} from 'sys.test.spec/src/types.mjs';

/**
 * @local
 */
export * from '../types.mjs';
export type MarginInput = number | [number] | [number, number] | [number, number, number, number];
export type Margin = [number, number, number, number];
export type UrlInput = string | URL | Location;

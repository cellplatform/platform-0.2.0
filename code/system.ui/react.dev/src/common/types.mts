/**
 * @external
 */
export type { Observable } from 'rxjs';
export type { IconType } from 'react-icons';

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
  DomRect,
} from 'sys.types/src/types';

export type { CssValue } from 'sys.ui.react.css/src/types.mjs';

export type {
  TestModel,
  TestHandlerArgs,
  TestSuiteModel,
  TestSuiteRunResponse,
  SpecImport,
  SpecImports,
} from 'sys.test.spec/src/types.mjs';

/**
 * @local
 */
export type UrlInput = string | URL | Location;
export type MarginInput = number | [number] | [number, number] | [number, number, number, number];
export type Margin = [number, number, number, number];

export type * from '../types.mjs';

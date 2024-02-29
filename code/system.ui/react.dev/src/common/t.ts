/**
 * @external
 */
export type { IconType } from 'react-icons';
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type {
  Disposable,
  DomRect,
  Event,
  EventBus,
  IgnoredResponse,
  Json,
  JsonMap,
  Lifecycle,
  ModuleImport,
  ModuleImporter,
  ModuleImports,
  Msecs,
  UntilObservable,
} from 'sys.types/src/types';

export type { CssValue } from 'sys.ui.react.css/src/types';

export type {
  SpecImport,
  SpecImporter,
  SpecImports,
  SpecModule,
  TestHandlerArgs,
  TestModel,
  TestSuiteModel,
  TestSuiteRunResponse,
} from 'sys.test.spec/src/types';

/**
 * @local
 */
export type UrlInput = string | URL | Location;
export type MarginInput = number | [number] | [number, number] | [number, number, number, number];
export type Margin = [number, number, number, number];

export type * from '../types';

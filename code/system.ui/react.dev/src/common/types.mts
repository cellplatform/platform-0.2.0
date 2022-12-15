/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type { EventBus, Event, Disposable, Json } from 'sys.types';
export type { CssValue } from 'sys.util.css';
export type {
  TestSuiteModel,
  BundleImport,
  TestSuiteRunResponse,
  TestHandlerArgs,
} from 'sys.test.spec/src/types.mjs';

/**
 * @local
 */
export * from '../types.mjs';

export type MarginInput = number | [number] | [number, number] | [number, number, number, number];
export type Margin = [number, number, number, number];

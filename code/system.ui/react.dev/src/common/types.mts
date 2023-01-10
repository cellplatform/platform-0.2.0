/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export * from 'sys.ui.react.dev.types';
export type {
  EventBus,
  Event,
  Disposable,
  Json,
  JsonMap,
  IgnoredResponse,
} from 'sys.types/src/types.mjs';
export type { CssValue } from 'sys.util.css';
export type { TestModel, BundleImport, TestHandlerArgs } from 'sys.test.spec/src/types.mjs';

/**
 * @local
 */
export * from '../types.mjs';
export type MarginInput = number | [number] | [number, number] | [number, number, number, number];
export type Margin = [number, number, number, number];
export type UrlInput = string | URL | Location;

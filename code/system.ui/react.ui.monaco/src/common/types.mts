/**
 * @external
 */
export type { Observable } from 'rxjs';
export type { ISelection } from 'monaco-editor';

// Inlined as type.
export type IRange = {
  /**
   * Line number on which the range starts (starts at 1).
   */
  readonly startLineNumber: number;
  /**
   * Column on which the range starts in line `startLineNumber` (starts at 1).
   */
  readonly startColumn: number;
  /**
   * Line number on which the range ends.
   */
  readonly endLineNumber: number;
  /**
   * Column on which the range ends in line `endLineNumber`.
   */
  readonly endColumn: number;
};

/**
 * @system
 */
export type { EventBus, Disposable } from 'sys.types/src/types.mjs';
export type { CssValue, DevCtx } from 'sys.ui.react.common/src/types.mjs';
export type {
  TestSuiteRunResponse,
  TestSuiteModel,
  TestHandlerArgs,
  BundleImport,
} from 'sys.test.spec/src/types.mjs';
export type { AutomergeText, CrdtDocRef, CrdtDocFile } from 'sys.data.crdt/src/types.mjs';

/**
 * @local
 */
export * from '../types.mjs';

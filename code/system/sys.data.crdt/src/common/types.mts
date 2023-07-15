/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type { PatchChange } from 'sys.data.json/src/types.mjs';
export type { DirManifest, Fs, ManifestFile } from 'sys.fs/src/types.mjs';
export type {
  SpecImport,
  SpecImports,
  TestSuiteModel,
  TestSuiteRunResponse,
} from 'sys.test.spec/src/types.mjs';
export type { TextCharDiff } from 'sys.text/src/types.mjs';
export type { Disposable, EventBus, Lifecycle } from 'sys.types/src/types.mjs';
export type { DevCtx, DevCtxState } from 'sys.ui.react.common/src/types.mjs';

/**
 * @system → ui
 */
export type {
  CssEdgesInput,
  CssValue,
  PropListItem,
  PropListProps,
  TextInputRef,
} from 'sys.ui.react.common/src/types.mjs';

/**
 * @local
 */
export * from '../sys.ui.common/types.mjs'; // TEMP 🐷
export * from '../types.mjs';

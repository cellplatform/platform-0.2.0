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
  Immutable,
  ImmutableNext,
  Lifecycle,
} from 'sys.types/src/types.mjs';

export type { PatchChange, PatchChangeHandler } from 'sys.data.json/src/types.mjs';
export type { DirManifest, Fs, ManifestFile } from 'sys.fs/src/types.mjs';
export type {
  SpecImport,
  SpecImports,
  TestSuiteModel,
  TestSuiteRunResponse,
} from 'sys.test.spec/src/types.mjs';
export type { TextCharDiff } from 'sys.text/src/types.mjs';
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
  PropListFieldSelectorClickHandler,
} from 'sys.ui.react.common/src/types.mjs';

/**
 * @local
 */
export * from '../types.mjs';

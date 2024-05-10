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
} from 'sys.types/src/types';

export type { PatchChange, PatchChangeHandler } from 'sys.data.json/src/types';
export type { DirManifest, Fs, ManifestFile } from 'sys.fs/src/types';
export type {
  SpecImport,
  SpecImports,
  TestSuiteModel,
  TestSuiteRunResponse,
} from 'sys.test.spec/src/types';
export type { TextCharDiff } from 'sys.text/src/types';
export type { DevCtx, DevCtxState } from 'sys.ui.react.common/src/types';

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
} from 'sys.ui.react.common/src/types';

/**
 * @local
 */
export * from '../types.mjs';

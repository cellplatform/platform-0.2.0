/**
 * @external
 */
export type { DelPatch, Patch, SpliceTextPatch } from '@automerge/automerge';
export type { Observable } from 'rxjs';

/**
 * @ext
 */
export type { Lens, Store, StoreIndexDb, WebStoreIndex } from 'ext.lib.automerge/src/types';
export type {
  EditorRange,
  EditorState,
  Monaco,
  MonacoCodeEditor,
  SelectionOffset,
  Selection,
} from 'ext.lib.monaco/src/types';

/**
 * @system
 */
export type {
  Disposable,
  EventBus,
  Lifecycle,
  Msecs,
  ObjectPath,
  TypedObjectPath,
  UntilObservable,
} from 'sys.types/src/types';

export type { SpecImport, SpecImports, TestSuiteRunResponse } from 'sys.test.spec/src/types';

/**
 * @local
 */
export type * from '../types';

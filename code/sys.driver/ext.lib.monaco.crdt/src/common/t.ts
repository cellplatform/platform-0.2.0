/**
 * @external
 */
export type { DelPatch, Patch, SpliceTextPatch } from '@automerge/automerge';
export type { Observable } from 'rxjs';

/**
 * @ext
 */
export type { Doc, Lens, Store, StoreIndex, StoreIndexDb } from 'ext.lib.automerge/src/types';
export type {
  EditorRange,
  EditorState,
  Monaco,
  MonacoCodeEditor,
  Selection,
  SelectionOffset,
} from 'ext.lib.monaco/src/types';

/**
 * @system
 */
export type {
  Disposable,
  EventBus,
  Json,
  JsonString,
  Lifecycle,
  Msecs,
  ObjectPath,
  PickRequired,
  TypedObjectPath,
  UntilObservable,
  UriString,
} from 'sys.types/src/types';

export type { SpecImport, SpecImports, TestSuiteRunResponse } from 'sys.test.spec/src/types';

/**
 * @local
 */
export type * from '../types';

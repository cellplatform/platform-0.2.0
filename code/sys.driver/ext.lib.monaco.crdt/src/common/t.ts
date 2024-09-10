/**
 * @external
 */
export type { DelPatch, Patch, SpliceTextPatch } from '@automerge/automerge';
export type { Observable } from 'rxjs';

/**
 * @ext
 */
export type {
  Doc,
  DocChanged,
  Lens,
  Store,
  StoreIndex,
  StoreIndexDb,
} from 'ext.lib.automerge/src/types';

export type {
  EditorCarets,
  EditorContent,
  EditorLanguage,
  EditorRange,
  Monaco,
  MonacoCodeEditor,
  MonacoEditorProps,
  MonacoEditorReadyArgs,
  MonacoEditorReadyHandler,
  Selection,
  SelectionOffset,
} from 'ext.lib.monaco/src/types';

/**
 * @system
 */
export type {
  Disposable,
  EventBus,
  IdString,
  Immutable,
  ImmutableChange,
  Index,
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

export type {
  Cmd,
  CmdMethodResponder,
  CmdMethodVoid,
  CmdTransport,
  CmdType,
} from 'sys.cmd/src/types';
export type { SpecImport, SpecImports, TestSuiteRunResponse } from 'sys.test.spec/src/types';

/**
 * @local
 */
export type * from '../types';

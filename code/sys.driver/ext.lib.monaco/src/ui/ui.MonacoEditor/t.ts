import type { t } from './common';

/**
 * <Component>
 */
export type MonacoEditorProps = {
  text?: string;
  language?: t.EditorLanguage;
  theme?: t.CommonTheme;
  placeholder?: string;
  enabled?: boolean;
  focusOnLoad?: boolean;
  tabSize?: number;
  minimap?: boolean;
  readOnly?: boolean;
  style?: t.CssValue;
  onChange?: t.MonacoEditorChangeHandler;
  onReady?: t.MonacoEditorReadyHandler;
  onDispose?: t.MonacoEditorDisposedHandler;
};

/**
 * REF: https://github.com/suren-atoyan/monaco-react
 *      https://github.com/microsoft/monaco-editor
 */
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { Monaco } from '@monaco-editor/react';

export { Monaco };
export type MonacoCodeEditor = monaco.editor.IStandaloneCodeEditor;

/**
 * Editor ready.
 */
export type MonacoEditorReadyHandler = (e: MonacoEditorReadyArgs) => void;
export type MonacoEditorReadyArgs = {
  readonly editor: MonacoCodeEditor;
  readonly monaco: Monaco;
  readonly dispose$: t.Observable<void>;
};

/**
 * Editor disposed.
 */
export type MonacoEditorDisposedHandler = (e: MonacoEditorDisposedArgs) => void;
export type MonacoEditorDisposedArgs = {
  readonly editor: MonacoCodeEditor;
  readonly monaco: Monaco;
};

/**
 * Editor changed.
 */
export type MonacoEditorChangeHandler = (e: MonacoEditorChangeArgs) => void;
export type MonacoEditorChangeArgs = {
  readonly event: monaco.editor.IModelContentChangedEvent;
  readonly state: t.EditorState;
};

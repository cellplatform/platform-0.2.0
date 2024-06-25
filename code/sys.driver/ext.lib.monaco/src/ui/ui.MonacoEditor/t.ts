import type { t } from './common';

/**
 * <Component>
 */
export type MonacoEditorProps = {
  text?: string;
  language?: t.EditorLanguage;
  theme?: t.CommonTheme;
  placeholder?: string;
  focusOnLoad?: boolean;
  tabSize?: number;
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
export type MonacoEditorReadyHandler = (e: MonacoEditorReadyHandlerArgs) => void;
export type MonacoEditorReadyHandlerArgs = {
  editor: MonacoCodeEditor;
  monaco: Monaco;
};

/**
 * Editor disposed.
 */
export type MonacoEditorDisposedHandler = (e: MonacoEditorDisposedHandlerArgs) => void;
export type MonacoEditorDisposedHandlerArgs = {
  editor: MonacoCodeEditor;
  monaco: Monaco;
};

/**
 * Editor changed.
 */
export type MonacoEditorChangeHandler = (e: MonacoEditorChangeHandlerArgs) => void;
export type MonacoEditorChangeHandlerArgs = {
  text: string;
  event: monaco.editor.IModelContentChangedEvent;
};

import type React from 'react';
import type { t } from './common';

type Edge = number | null;
type Pos = [Edge, Edge, Edge, Edge];
type Border = [number, number, number, number];

export type CrdtEditorInfoField = Extract<
  t.CrdtInfoField,
  'Repo' | 'Doc' | 'Doc.URI' | 'Doc.Object'
>;

/**
 * <Component>
 */
export type CrdtEditorProps = {
  data?: t.CrdtEditorData;
  editor?: t.CrdtEditorPropsEditor;
  historyStack?: boolean;
  border?: number | Border;
  borderColor?: string;
  enabled?: boolean;
  identityLabel?: { position: Pos };
  editorOnly?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onHistoryStackClick?: React.MouseEventHandler;
  onChange?: t.CrdtEditorChangeHandler;
  onDataReady?: t.CrdtEditorDataHandler;
};

export type CrdtEditorPropsEditor = {
  readOnly?: boolean;
  dataPath?: t.ObjectPath;
  editorPath?: t.ObjectPath;
  identity?: t.IdString;
};

/**
 * Data/State
 */
export type CrdtEditorData = {
  doc?: t.Doc;
  repo?: { store?: t.Store; index?: t.StoreIndex };
  info?: { fields?: t.CrdtEditorInfoField[] };
};

/**
 * Controller
 */
export type CrdtEditorController = t.Lifecycle;

/**
 * Events
 */
export type CrdtEditorChangeHandler = (e: CrdtEditorChangeHandlerArgs) => void;
export type CrdtEditorChangeHandlerArgs = {
  readonly change: t.DocChanged;
  readonly content: t.EditorContent;
};

export type CrdtEditorDataHandler = (e: CrdtEditorDataHandlerArgs) => void;
export type CrdtEditorDataHandlerArgs = {
  readonly path: t.ObjectPath;
  readonly doc: t.Doc;
  readonly lens: t.Lens<t.EditorContent>;
  readonly dispose$: t.Observable<void>;
};

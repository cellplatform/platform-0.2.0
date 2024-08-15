import type React from 'react';
import type { t } from './common';

type Edge = number | null;
type Pos = [Edge, Edge, Edge, Edge];

/**
 * <Component>
 */
export type CmdViewProps = {
  data?: t.CmdViewData;
  editor?: t.CmdViewPropsEditor;
  historyStack?: boolean;
  border?: number | [number, number, number, number];
  borderColor?: string;
  enabled?: boolean;
  identityLabel?: { position: Pos };
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onHistoryStackClick?: React.MouseEventHandler;
  onChange?: t.CmdViewChangeHandler;
  onDataReady?: t.CmdViewDataHandler;
};

export type CmdViewPropsEditor = {
  readOnly?: boolean;
  dataPath?: t.ObjectPath;
  editorPath?: t.ObjectPath;
  identity?: t.IdString;
};

/**
 * Data/State
 */
export type CmdViewData = {
  doc?: t.Doc;
  repo?: { store?: t.Store; index?: t.StoreIndex };
};

/**
 * Controller
 */
export type CmdViewEditorController = t.Lifecycle;

/**
 * Events
 */
export type CmdViewChangeHandler = (e: CmdViewChangeHandlerArgs) => void;
export type CmdViewChangeHandlerArgs = {
  readonly change: t.DocChanged;
  readonly content: t.EditorContent;
};

export type CmdViewDataHandler = (e: CmdViewDataHandlerArgs) => void;
export type CmdViewDataHandlerArgs = {
  readonly path: t.ObjectPath;
  readonly doc: t.Doc;
  readonly lens: t.Lens<t.EditorContent>;
  readonly dispose$: t.Observable<void>;
};

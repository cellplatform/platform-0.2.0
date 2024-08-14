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
  doc: t.Doc;
  change: t.DocChanged;
};

export type CmdViewDataHandler = (e: CmdViewDataHandlerArgs) => void;
export type CmdViewDataHandlerArgs = {
  path: t.ObjectPath;
  doc: t.Doc;
  lens: t.Lens<t.EditorContent>;
  dispose$: t.Observable<void>;
};

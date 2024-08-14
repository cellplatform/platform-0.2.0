import type React from 'react';
import type { t } from './common';

/**
 * <Component>
 */
export type CmdViewProps = {
  doc?: t.Doc;
  repo?: { store?: t.Store; index?: t.StoreIndex };
  editor?: t.CmdViewEditorProps;
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
};

export type CmdViewPropsEditor = {
  readOnly?: boolean;
  dataPath?: t.ObjectPath;
  editorPath?: t.ObjectPath;
  identity?: t.IdString;
};

export type CmdViewEditorController = t.Lifecycle;

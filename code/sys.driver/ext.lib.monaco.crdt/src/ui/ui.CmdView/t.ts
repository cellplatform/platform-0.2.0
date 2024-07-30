import type React from 'react';
import type { t } from './common';

/**
 * <Component>
 */
export type CmdViewProps = {
  doc?: t.Doc;
  repo?: { store?: t.Store; index?: t.StoreIndex };
  editor?: t.CmdViewEditorProps;
  historyStack?: boolean;
  border?: number | [number, number, number, number];
  borderColor?: string;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onHistoryStackClick?: React.MouseEventHandler;
};

export type CmdViewEditorProps = {
  readOnly?: boolean;
  lensPath?: t.ObjectPath;
  editorPath?: t.ObjectPath;
};

export type CmdViewEditorController = t.Lifecycle;

import type { t } from './common';

import type { InfoField as CrdtInfoField } from 'ext.lib.automerge/src/types';

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
};

export type CmdViewEditorProps = {
  readOnly?: boolean;
};

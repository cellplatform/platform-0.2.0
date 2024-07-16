import type { t } from './common';
export type * from '../common/t';

export type SampleEnv = {
  store: t.Store;
  docuri: string;
  accessToken?: string;
};

/**
 * UI Components
 */
export type SampleProps = {
  code?: string;
  style?: t.CssValue;
  env?: t.SampleEnv;
  theme?: t.CommonTheme;
  onChange?: t.EditorEventHandler;
  onCmdEnterKey?: t.EditorEventHandler;
};

export type EditorEventHandler = (e: EditorEventHandlerArgs) => void;
export type EditorEventHandlerArgs = t.EditorState;

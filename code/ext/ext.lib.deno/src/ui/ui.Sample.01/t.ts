import type { t } from './common';
export type * from '../common/t';

/**
 * UI Components
 */
export type SampleProps = {
  code?: string;
  style?: t.CssValue;
  onChange?: t.EditorEventHandler;
  onCmdEnterKey?: t.EditorEventHandler;
};

export type EditorEventHandler = (e: EditorEventHandlerArgs) => void;
export type EditorEventHandlerArgs = { text: string };

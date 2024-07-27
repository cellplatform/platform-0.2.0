import type { t } from './common';

export type MonospaceButtonEdge = { text: string; margin?: number | string; opacity?: number };

/**
 * Component: <MonospaceButton>
 */
export type MonospaceButtonProps = {
  text?: string;
  prefix?: string | MonospaceButtonEdge;
  suffix?: string | MonospaceButtonEdge;
  fontSize?: number | string;
  isOver?: boolean; // NB: option to force the button into an is-over state.
  isDown?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
  onClipboard?: MonospaceButtonClipboardHandler;
  onMouse?: t.ButtonMouseHandler;
};

export type MonospaceButtonClipboardHandler = (e: MonospaceButtonClipboardHandlerArgs) => void;
export type MonospaceButtonClipboardHandlerArgs = {
  write(text: string): void;
};

/**
 * Component: <Copied>
 */
export type CopiedProps = {
  text?: string;
  fontSize?: number | string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
};

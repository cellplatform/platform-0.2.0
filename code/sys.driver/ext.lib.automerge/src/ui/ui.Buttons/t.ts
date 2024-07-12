import type { t } from './common';

export type MonospaceButtonEdge = { text: string; margin?: number; opacity?: number };

/**
 * Component: <MonospaceButton>
 */
export type MonospaceButtonProps = {
  text?: string;
  prefix?: string | MonospaceButtonEdge;
  suffix?: string | MonospaceButtonEdge;
  fontSize?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
  onClipboard?: MonospaceButtonClipboardHandler;
};

export type MonospaceButtonClipboardHandler = (e: MonospaceButtonClipboardHandlerArgs) => void;
export type MonospaceButtonClipboardHandlerArgs = {
  write(text: string): void;
};

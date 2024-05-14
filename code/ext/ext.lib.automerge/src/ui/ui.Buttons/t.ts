import type { t } from './common';

/**
 * Component: <MonospaceButton>
 */
export type MonospaceButtonProps = {
  text?: string;
  prefix?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
  onClipboard?: MonospaceButtonClipboardHandler;
};

export type MonospaceButtonClipboardHandler = (e: MonospaceButtonClipboardHandlerArgs) => void;
export type MonospaceButtonClipboardHandlerArgs = {
  write(text: string): void;
};

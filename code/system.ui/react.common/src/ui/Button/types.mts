import type { t } from './common';

type MouseHandler = React.MouseEventHandler;
type Content = JSX.Element | string | number | false;

/**
 * Component
 */
export type ButtonProps = {
  children?: Content;
  label?: string;
  enabled?: boolean;
  block?: boolean;
  tooltip?: string;

  spinning?: boolean;
  overlay?: Content; // eg. a "copied" message.

  style?: t.CssValue;
  margin?: t.CssEdgesInput;
  padding?: t.CssEdgesInput;
  minWidth?: number;
  maxWidth?: number;
  disabledOpacity?: number;
  userSelect?: boolean;
  pressedOffset?: [number, number];

  onClick?: MouseHandler;
  onMouseDown?: MouseHandler;
  onMouseUp?: MouseHandler;
  onMouseEnter?: MouseHandler;
  onMouseLeave?: MouseHandler;
  onDoubleClick?: MouseHandler;
  onMouse?: t.ButtonMouseHandler;
};

export type CopyButtonProps = Omit<t.ButtonProps, 'overlay'> & {
  onCopy?: ButtonCopyHandler;
};

/**
 * Events
 */
export type ButtonMouseHandler = (e: ButtonMouseHandlerArgs) => void;
export type ButtonMouseHandlerArgs = {
  isDown: boolean;
  isOver: boolean;
  isEnabled: boolean;
  event: React.MouseEvent;
  action: 'MouseEnter' | 'MouseLeave' | 'MouseDown' | 'MouseUp';
};

export type ButtonCopyHandler = (e: ButtonCopyHandlerArgs) => void;
export type ButtonCopyHandlerArgs = {
  delay(msecs: t.Milliseconds): void;
  message(content: Content): void;
  write(value?: string | number): Promise<void>;
};

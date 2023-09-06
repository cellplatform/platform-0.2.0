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

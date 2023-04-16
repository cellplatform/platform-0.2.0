import type { t } from '../../common.t';

export type CardBorder = {
  color?: number | string;
  radius?: number | string;
};

export type CardBackground = {
  color?: number | string;
  blur?: number;
};

export type CardSizeDimension = number | { fixed?: number; min?: number; max?: number };
export type CardWidth = CardSizeDimension;
export type CardHeight = CardSizeDimension;

export type CardProps = {
  children?: React.ReactNode;
  background?: t.CardBackground;
  border?: t.CardBorder;
  showAsCard?: boolean;
  showReverse?: boolean;
  padding?: t.CssEdgesInput; // NB: padding is dropped if "NOT" showing as card.
  margin?: t.CssEdgesInput;
  width?: t.CardWidth;
  height?: t.CardHeight;
  userSelect?: string | boolean;
  shadow?: boolean | t.CssShadow;
  style?: t.CssValue;

  onClick?: React.MouseEventHandler;
  onDoubleClick?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
};

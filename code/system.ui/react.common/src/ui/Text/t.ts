import type { t } from '../common';

type StringOrNumber = number | string;

export type TextStyle = {
  align?: 'left' | 'center' | 'right';
  fontWeight?: 'light' | 'normal' | 'bold';
  italic?: boolean;
  textShadow?: string | [StringOrNumber, StringOrNumber]; // [0:offset-y, 1:color.format()]
  uppercase?: boolean;

  color?: t.CssValue['color'];
  fontSize?: t.CssValue['fontSize'];
  fontFamily?: t.CssValue['fontFamily'];
  letterSpacing?: t.CssValue['letterSpacing'];
  lineHeight?: t.CssValue['lineHeight'];
  opacity?: t.CssValue['opacity'];
};

export type TextProps = TextStyle & {
  className?: string;
  children?: React.ReactNode;
  block?: boolean;
  tooltip?: string;
  cursor?: string;
  isSelectable?: boolean;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
  onDoubleClick?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
};

import type { t } from '../../common.t';

export type MeasureSizeStyle = {
  width?: number;
  fontFamily?: t.CssValue['fontFamily'];
  fontSize?: t.CssValue['fontSize'];
  fontWeight?: t.CssValue['fontWeight'];
  fontStyle?: t.CssValue['fontStyle'];
  lineHeight?: t.CssValue['lineHeight'];
  letterSpacing?: t.CssValue['letterSpacing'];
};

export type MeasureSizeProps = MeasureSizeStyle & {
  content?: React.ReactNode;
  style?: t.CssValue;
};

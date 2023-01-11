import { t } from '../../common.t';

export type Size = { width: number; height: number };

export type MeasureSizeStyle = {
  width?: number;
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  fontStyle?: string;
  lineHeight?: string | number;
  letterSpacing?: string | number;
};

export type MeasureSizeProps = MeasureSizeStyle & {
  content?: React.ReactNode;
  style?: t.CssValue;
};

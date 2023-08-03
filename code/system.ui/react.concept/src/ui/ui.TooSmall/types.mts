import { type t } from './common';

export type TooSmallProps = {
  message?: string | JSX.Element;
  italic?: boolean;
  style?: t.CssValue;
};

import type { t } from '../common';

type N = number | null;

export type RenderCountProps = {
  absolute?: [N, N] | [N, N, N, N];
  prefix?: string;
  theme?: t.CommonTheme;
  opacity?: number;
  style?: t.CssValue;
};

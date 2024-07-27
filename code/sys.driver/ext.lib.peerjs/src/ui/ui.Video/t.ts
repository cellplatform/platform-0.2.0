import type { t } from './common';

/**
 * <Component>
 */
export type VideoProps = {
  peer?: t.PeerModel;
  stream?: MediaStream;
  muted?: boolean;
  empty?: string | JSX.Element | null;
  radius?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

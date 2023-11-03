import type { t } from './common';

/**
 * <Component>
 */
export type DevPeerCardProps = {
  prefix?: string;
  peer: { self: t.PeerModel; remote: t.PeerModel };
  style?: t.CssValue;
};

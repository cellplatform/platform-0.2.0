import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Peer' | 'Peer.Remotes';
export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  peer?: { self: t.PeerModel };
};

/**
 * <Component>
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

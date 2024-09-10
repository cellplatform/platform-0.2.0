import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Peer' | 'Peer.Remotes';

export type InfoCtx = { fields: t.InfoField[]; theme: t.CommonTheme };

/**
 * <Component>
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  self?: t.PeerModel;
  margin?: t.CssEdgesInput;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Data
 */
export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
};

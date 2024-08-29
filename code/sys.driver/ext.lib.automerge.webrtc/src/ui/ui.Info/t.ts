import type { t } from './common';

import type { InfoData as AutomergeInfoData } from 'ext.lib.automerge/src/types';
import type { InfoData as PeerInfoData } from 'ext.lib.peerjs/src/types';

type P = t.PropListProps;

export type InfoField =
  | 'Visible'
  | 'Module'
  | 'Module.Verify'
  | 'Component'
  | 'Peer'
  | 'Peer.Remotes'
  | 'Repo'
  | 'Network.Shared'
  | 'Network.Transfer';

export type InfoCtx = {
  fields: t.InfoField[];
  theme: t.CommonTheme;
};

/**
 * <Component>
 */
export type InfoProps = t.InfoHandlers & {
  title?: P['title'];
  width?: P['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  network?: t.NetworkStore;
  margin?: t.CssEdgesInput;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

/**
 * Data
 */
export type InfoData = {
  visible?: t.InfoVisible;
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  shared?: InfoShared | InfoShared[];
};

export type InfoShared = t.InfoDoc;
export type InfoObject = {
  visible?: boolean;
  expand?: { level?: number; paths?: string[] };
  beforeRender?: (mutate: unknown) => void;
  dotMeta?: boolean; // Default true. Deletes a [.meta] field if present.
};

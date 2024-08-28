import type { t } from './common';

import type { InfoData as AutomergeInfoData } from 'ext.lib.automerge/src/types';
import type { InfoData as PeerInfoData } from 'ext.lib.peerjs/src/types';

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

export type InfoFieldCtx = { fields: t.InfoField[]; theme: t.CommonTheme; stateful: boolean };

export type InfoData = {
  visible?: t.InfoDataVisible;
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  peer?: PeerInfoData['peer'];
  repo?: AutomergeInfoData['repo'];
  network?: t.NetworkStore;
  shared?: InfoDataShared | InfoDataShared[];
};

export type InfoDataShared = t.InfoDoc;
export type InfoDataObject = {
  visible?: boolean;
  expand?: { level?: number; paths?: string[] };
  beforeRender?: (mutate: unknown) => void;
  dotMeta?: boolean; // Default true. Deletes a [.meta] field if present.
};

/**
 * Component
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: (t.InfoField | undefined)[];
  data?: t.InfoData;
  stateful?: boolean;
  margin?: t.CssEdgesInput;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

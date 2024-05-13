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
  | 'Network.Shared.Json'
  | 'Network.Transfer';

export type InfoData = {
  visible?: t.InfoDataVisible;
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  peer?: PeerInfoData['peer'];
  repo?: AutomergeInfoData['repo'];
  network?: t.NetworkStore;
  shared?: InfoDataShared | InfoDataShared[];
};

export type InfoDataShared = {
  label?: string;
  name?: string;
  lens?: t.ObjectPath;
  object?: InfoDataObject;
  uri?: t.InfoDataDocumentUri;
  onIconClick?: (e: {}) => void;
};

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
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

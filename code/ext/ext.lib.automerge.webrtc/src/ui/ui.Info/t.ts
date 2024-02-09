import type { t } from './common';

import type { InfoData as AutomergeInfoData } from 'ext.lib.automerge/src/types';
import type { InfoData as PeerInfoData } from 'ext.lib.peerjs/src/types';

export type InfoField =
  | 'Module'
  | 'Module.Verify'
  | 'Component'
  | 'Peer'
  | 'Peer.Remotes'
  | 'Repo'
  | 'Network.Shared'
  | 'Network.Shared.Json'
  | 'Network.Transfer'
  | 'Visible';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  peer?: PeerInfoData['peer'];
  repo?: AutomergeInfoData['repo'];
  network?: t.NetworkStore;
  shared?: {
    object?: { expand?: { level?: number; paths?: string[] } };
    onIconClick: (e: {}) => void;
  };
  visible?: {
    value?: boolean;
    enabled?: boolean;
    label?: string;
    onToggle?: (current: boolean) => void;
  };
};

/**
 * Component
 */
export type InfoProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.InfoField[];
  data?: t.InfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};

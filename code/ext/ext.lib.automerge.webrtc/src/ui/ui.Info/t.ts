import type { t } from './common';

import type { InfoData as AutomergeData } from 'ext.lib.automerge/src/types';
import type { InfoData as PeerData } from 'ext.lib.peerjs/src/types';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Peer' | 'Peer.Remotes' | 'Repo';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  peer?: PeerData['peer'];
  repo?: AutomergeData['repo'];
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

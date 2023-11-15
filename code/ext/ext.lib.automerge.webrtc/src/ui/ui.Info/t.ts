import type { InfoData as AutomergeData } from 'ext.lib.automerge/src/types';
import type { InfoData as PeerData } from 'ext.lib.peerjs/src/types';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Peer' | 'Peer.Remotes' | 'Repo';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  peer?: PeerData['peer'];
  repo?: AutomergeData['repo'];
};

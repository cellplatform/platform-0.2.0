import type { t } from './common';
import { InfoData as PeerInfoData } from 'ext.lib.peerjs/src/types';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Peer' | 'Peer.Remotes';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { name?: string };
  peer?: PeerInfoData['peer'];
};

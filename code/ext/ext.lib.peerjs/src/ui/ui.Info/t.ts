import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Peer' | 'Peer.Remotes';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { label?: string; name?: string };
  peer?: { self: t.PeerModel };
};

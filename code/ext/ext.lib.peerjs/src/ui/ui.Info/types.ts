import type { t } from './common';

export type InfoField = 'Module' | 'Module.Verify' | 'Component' | 'Peer';

export type InfoData = {
  url?: { href: string; title?: string };
  component?: { name?: string };
  peer?: { self: t.PeerModel };
};

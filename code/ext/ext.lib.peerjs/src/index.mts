/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
import { Peer } from './Webrtc';
export { Peer, Webrtc } from './Webrtc';

/**
 * Library: UI
 */
import { AvatarTray } from './ui/ui.AvatarTray';
import { Connector, ConnectorConfig } from './ui/ui.Connector';
import { PeerCard } from './ui/ui.Dev.PeerCard';
import { Info } from './ui/ui.Info';
import { Video } from './ui/ui.Video';
import { Icons } from './ui/Icons';

export { Info };
export const PeerUI = {
  peer: Peer.init,
  Info,
  Connector,
  ConnectorConfig,
  AvatarTray,
  Video,
  Icons,
  Dev: { PeerCard },
} as const;

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

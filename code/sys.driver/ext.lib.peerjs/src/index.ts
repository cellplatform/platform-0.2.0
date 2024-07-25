/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg';
export { Pkg };

/**
 * Library
 */
import { Peer } from './Webrtc';
export { Peer, Webrtc } from './Webrtc';

/**
 * Library: UI
 */
import { Icons } from './ui/Icons';
import { AvatarTray } from './ui/ui.AvatarTray';
import { Connector, ConnectorConfig } from './ui/ui.Connector';
import { PeerCard } from './ui/ui.Dev.PeerCard';
import { Info } from './ui/ui.Info';
import { Video } from './ui/ui.Video';
import { PeerUriButton } from './ui/ui.Button.PeerUri';

export { Info, PeerUriButton };
export const PeerUI = {
  Info,
  Connector,
  ConnectorConfig,
  AvatarTray,
  Video,
  Icons,
  PeerUriButton,
  Dev: { PeerCard },
} as const;

/**
 * Dev
 */
export { Specs } from './test.ui/entry.Specs';

/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
import { Webrtc } from './Webrtc';
export { PeerModel, Webrtc } from './Webrtc';

/**
 * Library: UI
 */
import { AvatarTray } from './ui/ui.AvatarTray';
import { Connector } from './ui/ui.Connector';
import { PeerCard } from './ui/ui.Dev.PeerCard';
import { Info } from './ui/ui.Info';
import { Video } from './ui/ui.Video';

export { Info };
export const UI = {
  peer: Webrtc.peer,
  Info,
  Connector,
  AvatarTray,
  Video,
  Dev: { PeerCard },
} as const;

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

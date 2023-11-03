/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
import { Webrtc } from './Webrtc';
export { Webrtc, PeerModel } from './Webrtc';
export { PeerDev } from './ui/ui.Dev';

/**
 * Library: UI
 */
import { Connector } from './ui/ui.Connector';
import { AvatarTray } from './ui/ui.AvatarTray';
import { Video } from './ui/ui.Video';
import { PeerCard } from './ui/ui.dev.PeerCard';

export const UI = {
  peer: Webrtc.peer,
  Connector,
  AvatarTray,
  Video,
  dev: { PeerCard },
} as const;

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

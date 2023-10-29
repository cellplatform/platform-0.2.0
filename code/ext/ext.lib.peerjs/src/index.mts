/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { Webrtc, PeerModel } from './Webrtc';
export { PeerDev } from './ui/ui.Dev';

/**
 * Library: UI
 */
import { Connector } from './ui/ui.Connector';
import { AvatarTray } from './ui/ui.AvatarTray';
export const UI = {
  Connector,
  AvatarTray,
} as const;

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

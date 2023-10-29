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

import { Connector } from './ui/ui.Connector';
export const WebrtcUI = {
  Connector,
} as const;

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

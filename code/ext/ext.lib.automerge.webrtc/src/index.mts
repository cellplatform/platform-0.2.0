/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { WebrtcNetworkAdapter, WebrtcStore } from './network.Webrtc';

/**
 * Library: UI
 */
import { Info } from './ui/ui.Info';
import { Connection } from './ui/ui.Connection';
export { Info };
export const UI = {
  Info,
  Connection,
} as const;

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { WebrtcStore } from './Store.Network';
export { PeerjsNetworkAdapter } from './common';

/**
 * Library: UI
 */
export { Info } from './ui/ui.Info';
export { NetworkConnection } from './ui/ui.Network.Connection';
export { PeerRepoList } from './ui/ui.PeerRepoList';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

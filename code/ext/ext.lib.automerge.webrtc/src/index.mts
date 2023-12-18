/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
export { WebrtcNetworkAdapter, WebrtcStore } from './Store.Network';

/**
 * Library: UI
 */
export { Info } from './ui/ui.Info';
export { Connection } from './ui/ui.Connection';
export { PeerRepoList } from './ui/ui.PeerRepoList';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

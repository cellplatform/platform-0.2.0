/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Data Structures
 */
export { Crdt } from './crdt';
export { Automerge } from './driver.Automerge';

/**
 * UI
 */
export { CrdtViews } from './ui';

/**
 * Helpers
 */
export { PeerSyncer } from './crdt/crdt.DocSync';
export { toObject } from './crdt/helpers';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

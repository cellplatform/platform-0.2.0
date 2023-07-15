/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Data Structures
 */
export { Automerge } from './driver.Automerge';
export { Crdt } from './crdt';

/**
 * UI
 */
export { CrdtViews } from './ui';

/**
 * Helpers
 */
export { toObject } from './crdt/crdt.helpers';
export { PeerSyncer } from './crdt/crdt.DocSync';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

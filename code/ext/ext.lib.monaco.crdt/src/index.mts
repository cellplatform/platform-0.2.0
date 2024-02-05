/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Library
 */
import { Monaco as MonacoBase } from './common';
import { Syncer } from './ui/logic.Syncer';

export { Syncer };
export const Monaco = {
  ...MonacoBase,
  Crdt: { Syncer },
} as const;

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

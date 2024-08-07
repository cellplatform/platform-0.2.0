/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg';
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
export { Specs } from './test.ui/entry.Specs';

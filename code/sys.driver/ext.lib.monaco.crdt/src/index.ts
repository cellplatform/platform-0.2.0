/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg';
export { Pkg };

/**
 * Library
 */
import { Monaco as MonacoBase } from './common';
import { Syncer } from './ui/u.Syncer';
import { CrdtEditor } from './ui/ui.CrdtEditor';

export { CrdtEditor, Syncer };

export const Monaco = {
  ...MonacoBase,
  Crdt: { Syncer, Editor: CrdtEditor },
} as const;

/**
 * Dev
 */
export { Specs } from './test.ui/entry.Specs';

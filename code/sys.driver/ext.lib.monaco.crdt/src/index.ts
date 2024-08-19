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

export { CrdtEditor as CmdView, Syncer };

export const Monaco = {
  ...MonacoBase,
  Crdt: { Syncer, CmdView: CrdtEditor },
} as const;

/**
 * Dev
 */
export { Specs } from './test.ui/entry.Specs';

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
import { CmdView } from './ui/ui.CmdView';

export { Syncer, CmdView };

export const Monaco = {
  ...MonacoBase,
  Crdt: { Syncer, CmdView },
} as const;

/**
 * Dev
 */
export { Specs } from './test.ui/entry.Specs';

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
import { CmdView } from './ui/ui.CmdView';

export { CmdView, Syncer };

export const Monaco = {
  ...MonacoBase,
  Crdt: { Syncer, CmdView },
} as const;

/**
 * Dev
 */
export { Specs } from './test.ui/entry.Specs';

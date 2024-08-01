import { SyncerCmd } from './u.Cmd';
import { SyncerIdentity } from './u.Identity';
import { SyncerLens } from './u.Lens';
import { SyncerPatch } from './u.Patch';
import { SyncerPath } from './u.Path';

export { SyncerCmd, SyncerIdentity, SyncerLens, SyncerPatch, SyncerPath };

export const Util = {
  Identity: SyncerIdentity,
  Lens: SyncerLens,
  Patch: SyncerPatch,
  Path: SyncerPath,
  Cmd: SyncerCmd,
} as const;

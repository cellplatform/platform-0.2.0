import { SyncerIdentity } from './u.Identity';
import { SyncerLens } from './u.Lens';
import { SyncerPatch } from './u.Patch';
import { SyncerPath } from './u.Path';

export { SyncerIdentity, SyncerLens, SyncerPatch, SyncerPath };

export const Util = {
  Identity: SyncerIdentity,
  Lens: SyncerLens,
  Patch: SyncerPatch,
  Path: SyncerPath,
} as const;

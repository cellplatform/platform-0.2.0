import { CmdUtil } from './u.Cmd';
import { IdentityUtil } from './u.Identity';
import { LensUtil } from './u.Lens';
import { PatchUtil } from './u.Patch';
import { PathUtil } from './u.Path';

export { CmdUtil, IdentityUtil, LensUtil, PatchUtil, PathUtil };

export const Util = {
  Identity: IdentityUtil,
  Lens: LensUtil,
  Patch: PatchUtil,
  Path: PathUtil,
  Cmd: CmdUtil,
} as const;

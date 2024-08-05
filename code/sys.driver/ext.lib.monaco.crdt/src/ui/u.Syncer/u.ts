import { CmdUtil } from './u.Cmd';
import { IdentityUtil } from './u.Identity';
import { LensUtil } from './u.Lens';
import { PatchUtil } from './u.Patch';
import { PathUtil } from './u.Path';
import { PingUtil } from './u.Ping';

export { CmdUtil, IdentityUtil, LensUtil, PatchUtil, PathUtil, PingUtil };

export const Util = {
  Cmd: CmdUtil,
  Identity: IdentityUtil,
  Lens: LensUtil,
  Patch: PatchUtil,
  Path: PathUtil,
  Ping: PingUtil,
} as const;

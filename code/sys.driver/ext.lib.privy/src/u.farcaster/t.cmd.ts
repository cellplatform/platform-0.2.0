import type { t } from './common';
import type { CastAdd } from '@standard-crypto/farcaster-js-hub-rest';

/**
 * Commands
 */
export type FarcasterCmd = Get | GetR | SendCast | SendCastR | ReqSigner | ReqSignerR;

type Get = t.CmdType<'get:fc', {}>;
type GetR = t.CmdType<'get:fc:res', {}>;

type SendCast = t.CmdType<'send:cast', { text: string }>;
type SendCastR = t.CmdType<'send:cast:res', { submitted: CastAdd }>;

type ReqSigner = t.CmdType<'req:signer', {}>;
type ReqSignerR = t.CmdType<'req:signer:res', {}>;

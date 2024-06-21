import type { t } from './common';
import { Cmd } from './common';

import type { CastAdd } from '@standard-crypto/farcaster-js-hub-rest';

/**
 * Commands
 */
export type FarcasterCmd = Get | GetR | SendCast | SendCastR;

type Get = t.CmdType<'get:fc', {}, GetR>;
type GetR = t.CmdType<'get:fc:res', {}>;

type SendCast = t.CmdType<'send:cast', { text: string }, SendCastR>;
type SendCastR = t.CmdType<'send:cast:res', { submitted: CastAdd }>;

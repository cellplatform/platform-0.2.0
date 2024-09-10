import type { t } from './common';

/**
 * Commands for the syncer.
 */
export type SyncCmdType = Ping | PingR | Purge | PurgeR | UpdateEditor | UpdateState;

/**
 * Ping: report that the status of the identity.
 * NB: useful for determining if the editor is still alive (will timeout if dead).
 */
type Ping = t.CmdType<'Ping', { identity: t.IdString }>;
type PingR = t.CmdType<'Ping:R', { identity: t.IdString; ok: boolean }>;

type Purge = t.CmdType<'Purge', { identity: t.IdString }>;
type PurgeR = t.CmdType<'Purge:R', t.SyncPurgeResponse>;

type UpdateParams = { identity: t.IdString } & SyncCmdUpdate;
type UpdateState = t.CmdType<'Update:State', UpdateParams>;
type UpdateEditor = t.CmdType<'Update:Editor', UpdateParams>;

export type SyncCmdUpdate = {
  selections?: boolean;
  text?: boolean;
};

export type SyncCmdMethods = {
  readonly ping: t.CmdMethodResponder<Ping, PingR>;
  readonly purge: t.CmdMethodResponder<Purge, PurgeR>;
  readonly update: {
    readonly editor: t.CmdMethodVoid<UpdateEditor>;
    readonly state: t.CmdMethodVoid<UpdateState>;
  };
};

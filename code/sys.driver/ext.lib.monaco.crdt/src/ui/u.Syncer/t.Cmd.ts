import type { t } from './common';

type O = Record<string, unknown>;

/**
 * Commands for the syncer.
 */
export type SyncCmdType = Ping | PingR;

/**
 * Ping: report that the status of the identity.
 * NB: useful for determining if the editor is still alive (will timeout if dead).
 */
type Ping = t.CmdType<'Ping', { identity: string }>;
type PingR = t.CmdType<'Ping:R', { identity: string; ok: boolean }>;

export type SyncCmdMethods = {
  ping: t.CmdMethodResponder<Ping, PingR>;
};

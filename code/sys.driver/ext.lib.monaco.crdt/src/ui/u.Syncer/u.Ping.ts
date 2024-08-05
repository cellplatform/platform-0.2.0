import { type t } from './common';

/**
 * Helpers for working with the ping <Cmd> method.
 */
export const PingUtil = {
  /**
   * Determines the number of identities still alive
   */
  stillAlive(cmd: t.SyncCmdMethods, identities: string[], options: { timeout?: t.Msecs } = {}) {
    return new Promise<t.SyncPurgeResponse>((resolve) => {
      const { timeout = 500 } = options;
      const ping = (identity: string) => cmd.ping({ identity }, { timeout });
      const requests = identities.map((identity) => ping(identity));

      let _resolved = false;
      const res: t.SyncPurgeResponse = {
        alive: [],
        dead: [],
        total: {
          get identities() {
            return res.total.alive + res.total.dead;
          },
          get alive() {
            return res.alive.length;
          },
          get dead() {
            return res.dead.length;
          },
        },
      };

      const done = (identity: string, options: { timedOut?: boolean } = {}) => {
        const { timedOut = false } = options;
        if (_resolved) return;
        if (timedOut) res.dead.push(identity);
        if (!timedOut) res.alive.push(identity);
        if (res.total.identities === identities.length) {
          _resolved = true;
          resolve(res);
        }
      };

      requests.forEach((pending) =>
        pending
          .onComplete((e) => {
            const identity = pending.req.params.identity;
            done(identity);
          })
          .onTimeout((e) => {
            const identity = pending.req.params.identity;
            done(identity, { timedOut: true });
          }),
      );
    });
  },
} as const;

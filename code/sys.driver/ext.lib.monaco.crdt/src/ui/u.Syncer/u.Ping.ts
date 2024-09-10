import { R, type t } from './common';

/**
 * Helpers for working with the ping <Cmd> method.
 */
export const PingUtil = {
  /**
   * Determines the number of identities still alive
   */
  alive(
    cmd: t.SyncCmdMethods,
    identities: t.IdString[],
    options: { timeout?: t.Msecs | t.Msecs[] } = {},
  ) {
    return new Promise<t.SyncPurgeResponse>(async (resolve) => {
      const timeouts = wrangle.retryTimeouts(options.timeout);
      const alive: t.IdString[] = [];
      const dead: t.IdString[] = [];

      const query = async (retry: t.Index, identities: t.IdString[]) => {
        if (retry > timeouts.length - 1) return;

        const timeout = timeouts[retry];
        const res = await pingAlive(cmd, identities, { timeout });
        alive.push(...res.alive);

        const isLast = retry === timeouts.length - 1;
        if (!isLast && res.total.dead > 0) await query(retry + 1, res.dead);
        if (isLast) dead.push(...res.dead);
      };

      await query(0, identities);
      resolve(PurgeResponse.create(alive, dead));
    });
  },
} as const;

/**
 * Helpers
 */
const PurgeResponse = {
  create(alive: t.IdString[] = [], dead: t.IdString[] = []) {
    const res: t.SyncPurgeResponse = {
      alive: R.uniq(alive),
      dead: R.uniq(dead),
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
    return res;
  },

  merge(a: t.SyncPurgeResponse, b: t.SyncPurgeResponse) {
    const alive = [...a.alive, ...b.alive];
    const dead = [...a.dead, ...b.dead];
    return PurgeResponse.create(alive, dead);
  },
} as const;

/**
 * Performs a ping operation against the given set of identities.
 */
async function pingAlive(
  cmd: t.SyncCmdMethods,
  identities: t.IdString[],
  options: { timeout?: t.Msecs } = {},
) {
  return new Promise<t.SyncPurgeResponse>((resolve) => {
    const { timeout = 500 } = options;
    const res = PurgeResponse.create();
    let _resolved = false;

    const done = (identity: t.IdString, options: { timedOut?: boolean } = {}) => {
      const { timedOut = false } = options;
      if (_resolved) return;
      if (timedOut) res.dead.push(identity);
      if (!timedOut) res.alive.push(identity);
      if (res.total.identities === identities.length) {
        _resolved = true;
        resolve(res);
      }
    };

    const ping = (identity: t.IdString, timeout: t.Msecs) => cmd.ping({ identity }, { timeout });
    const requests = identities.map((identity) => ping(identity, timeout));
    requests.forEach((pending) =>
      pending
        .onComplete(() => {
          const identity = pending.req.params.identity;
          done(identity);
        })
        .onTimeout(() => {
          const identity = pending.req.params.identity;
          done(identity, { timedOut: true });
        }),
    );
  });
}

const wrangle = {
  retryTimeouts(timeout?: t.Msecs | t.Msecs[]): t.Msecs[] {
    if (!timeout) return [500, 1500];
    return Array.isArray(timeout) ? timeout : [timeout];
  },
} as const;

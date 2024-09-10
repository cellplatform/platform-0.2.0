import { CrdtInfo, type t, DEFAULTS } from './common';

/**
 * Delegate to the base Automerge library.
 */
export function repo(ctx: t.InfoCtx, network?: t.NetworkStore) {
  if (!network) return undefined;

  const value = (
    <CrdtInfo.Stateful
      theme={ctx.theme}
      fields={['Repo']}
      data={{ repo: DEFAULTS.repo }}
      repos={{ [DEFAULTS.repo]: network.repo }}
      style={{ flex: 1 }}
    />
  );
  return { value };
}

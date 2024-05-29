import { AutomergeInfo, type t } from './common';

/**
 * Delegate to the base Automerge library.
 */
export function repo(ctx: t.InfoFieldCtx, data: t.InfoData) {
  const repo = wrangle.repo(data);
  if (!repo) return undefined;

  const value = (
    <AutomergeInfo
      stateful={ctx.stateful}
      fields={['Repo']}
      data={{ repo }}
      theme={ctx.theme}
      style={{ flex: 1 }}
    />
  );
  return { value };
}

/**
 * Helpers
 */
const wrangle = {
  repo(data: t.InfoData) {
    if (data.repo) return data.repo;
    if (data.network) {
      const { store, index } = data.network;
      return { store, index };
    }
    return undefined;
  },
} as const;

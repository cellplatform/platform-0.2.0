import { AutomergeInfo, type t } from './common';

/**
 * Delegate to the base Automerge library.
 */
export function repo(ctx: t.InfoFieldCtx, data: t.InfoData) {
  if (data.repo) return AutomergeInfo.Field.repo(data.repo);
  if (data.network) return wrangle.fromNetwork(data.network);
  return undefined;
}

/**
 * Helpers
 */
const wrangle = {
  fromNetwork(network: t.NetworkStore) {
    const { store, index } = network;
    return AutomergeInfo.Field.repo({ store, index });
  },
} as const;

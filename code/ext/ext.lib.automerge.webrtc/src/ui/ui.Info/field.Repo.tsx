import { InfoField } from 'ext.lib.automerge';
import { type t } from './common';

/**
 * Delegate to the base Automerge library.
 */
export function repo(data: t.InfoData, fields: t.InfoField[]) {
  if (data.repo) return InfoField.repo(data.repo);
  if (data.network) return wrangle.fromNetwork(data.network);
  return undefined;
}

/**
 * Helpers
 */
const wrangle = {
  fromNetwork(network: t.NetworkStore) {
    const { store, index } = network;
    return InfoField.repo({ store, index });
  },
} as const;

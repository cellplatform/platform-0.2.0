import { LabelItem, Typenames, type t } from './common';

export * from '../common';
export { StoreIndex } from '../../Store.Index';
export const Model = LabelItem.Stateful.Model;

/**
 * Constants
 */
const filter: t.StoreIndexFilter = (e) => {
  // NB: ephemeral docs are excluded from the visual document list.
  if (e.doc.meta?.ephemeral) return false;
  return true;
};

export const DEFAULTS = {
  typename: Typenames.RepoList,
  filter,
  timeout: { delete: 5000 },
} as const;

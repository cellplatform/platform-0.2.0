import { Model, type t } from './common';
export type ItemInput = t.LabelItem | t.LabelItemState | t.RepoItemCtx;

export const Data = {
  item: (input: ItemInput) => Model.data<t.RepoItemData>(asItem(input)),
} as const;

/**
 * Helpers
 */
function asItem(input: ItemInput): t.LabelItem | t.LabelItemState {
  return 'state' in input ? input.state : input;
}

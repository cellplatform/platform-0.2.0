import { Model, type t, DocUri as Uri } from './common';
export type ItemInput = t.LabelItem | t.LabelItemState | t.RepoItemModel;

export const Data = {
  Uri,
  item: (input: ItemInput) => Model.data<t.RepoItemData>(asItem(input)),
} as const;

/**
 * Helpers
 */
function asItem(input: ItemInput): t.LabelItem | t.LabelItemState {
  return 'state' in input ? input.state : input;
}

import { Model, toObject, type t } from './common';

type ItemInput = t.LabelItem | t.LabelItemState | t.RepoItemCtx;

export const Data = {
  item(input: ItemInput) {
    return Model.data<t.RepoItemData>(asItem(input));
  },

  findIndexOf(ctx: t.RepoListCtxGet, input: ItemInput) {
    const data = Data.item(input);
    const docs = ctx().index.doc.current.docs;
    const index = docs.findIndex((item) => item.uri === data.uri);
    const item = docs[index];
    const exists = index > -1;
    const position = { index, total: docs.length };
    return { exists, item, position } as const;
  },

  clickArgs(ctx: t.RepoListCtxGet, input: ItemInput): t.RepoListClickHandlerArgs {
    const { store, index } = ctx();
    const { item, position } = Data.findIndexOf(ctx, input);
    return { store, index, position, item: toObject(item) };
  },
} as const;

/**
 * Helpers
 */

function asItem(input: ItemInput): t.LabelItem | t.LabelItemState {
  return 'state' in input ? input.state : input;
}

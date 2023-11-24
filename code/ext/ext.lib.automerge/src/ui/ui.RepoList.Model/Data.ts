import { Model, toObject, type t } from './common';
import { Wrangle } from './u.Wrangle';

type ItemInput = t.LabelItem | t.LabelItemState | t.RepoItemCtx;

export const Data = {
  item(input: ItemInput) {
    return Model.data<t.RepoItemData>(asItem(input));
  },

  findIndexOf(getCtx: t.RepoListCtxGet, input: ItemInput) {
    const ctx = getCtx();
    const data = Data.item(input);
    const docs = Wrangle.filterDocs(ctx.index.doc.current, ctx.filter);
    const index = docs.findIndex((item) => item.uri === data.uri);
    const item = docs[index];
    const exists = index > -1;
    const position = { index, total: docs.length };
    return { exists, item, position } as const;
  },

  clickArgs(getCtx: t.RepoListCtxGet, input: ItemInput): t.RepoListClickHandlerArgs {
    const { store, index } = getCtx();
    const { item, position } = Data.findIndexOf(getCtx, input);
    return { store, index, position, item: toObject(item) };
  },
} as const;

/**
 * Helpers
 */

function asItem(input: ItemInput): t.LabelItem | t.LabelItemState {
  return 'state' in input ? input.state : input;
}

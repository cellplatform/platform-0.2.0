import { Model, toObject, type t } from './common';

type ItemInput = t.LabelItem | t.LabelItemState | t.RepoItemCtx;

export const Data = {
  item(input: ItemInput) {
    return Model.data<t.RepoItemData>(Wrangle.item(input));
  },

  indexItem(ctx: t.RepoListCtxGet, input: ItemInput) {
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
    const { item, position } = Data.indexItem(ctx, input);
    return { store, index, position, item: toObject(item) };
  },
} as const;

/**
 * Helpers
 */
export const Wrangle = {
  item(input: ItemInput): t.LabelItem | t.LabelItemState {
    if ('state' in input) return input.state;
    return input;
  },
} as const;

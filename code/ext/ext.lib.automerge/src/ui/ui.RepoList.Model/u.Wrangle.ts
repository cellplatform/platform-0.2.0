import { StoreIndex } from '../../crdt';
import { Model, rx, toObject, type t } from './common';
import { Data, type ItemInput } from './u.Data';

type Index = number;
type Id = string;

export const WrangleItem = {
  $(item: t.RepoItemModel) {
    const mode = () => Data.item(item).kind;
    return {
      action$(action: t.RepoListAction, kind?: t.RepoListActionCtx['kind']) {
        return item.events.cmd.action.kind(action).pipe(
          rx.filter((e) => mode() === 'Doc'), // NB: defensive guard.
          rx.map((e) => e.ctx as t.RepoListActionCtx),
          rx.filter((e) => (kind ? e.kind === kind : true)),
        );
      },
    } as const;
  },

  get(ctx: t.GetRepoListModel, input: ItemInput) {
    const { index, filter } = ctx();
    const data = Data.item(input);
    const docs = StoreIndex.Filter.docs(index.doc.current, filter);
    const i = docs.findIndex((item) => item.uri === data.uri);
    const item = docs[i];
    const uri = item?.uri || '';
    const exists = i > -1;
    const total = docs.length;
    const position = { index: i, total };
    return { exists, uri, position, item, data } as const;
  },

  click(ctx: t.GetRepoListModel, input: ItemInput): t.RepoListClickHandlerArgs {
    const { store, index } = ctx();
    const { item, position } = WrangleItem.get(ctx, input);
    return { store, index, position, item: toObject(item) };
  },
} as const;

export const Wrangle = {
  Item: WrangleItem,

  getItem(ctx: t.GetRepoListModel, target?: Index | Id) {
    const { list } = ctx();
    const [item] = Model.List.getItem(list.state, target || '');
    return item ? WrangleItem.get(ctx, item) : undefined;
  },

  total(ctx: t.GetRepoListModel) {
    const { index, filter } = ctx();
    return StoreIndex.Filter.docs(index.doc.current, filter).length;
  },
} as const;

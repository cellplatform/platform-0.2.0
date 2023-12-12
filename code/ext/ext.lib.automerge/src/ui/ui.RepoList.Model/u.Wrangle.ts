import { Data, type ItemInput } from './Data';
import { Model, StoreIndex, rx, toObject, type t } from './common';

type Index = number;
type Id = string;

export const WrangleItem = {
  $(item: t.RepoItemCtx) {
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

  get(getCtx: t.RepoListCtxGet, input: ItemInput) {
    const ctx = getCtx();
    const data = Data.item(input);
    const docs = Wrangle.filterDocs(ctx.index.doc.current, ctx.filter);
    const index = docs.findIndex((item) => item.uri === data.uri);
    const item = docs[index];
    const uri = item?.uri || '';
    const exists = index > -1;
    const total = docs.length;
    const position = { index, total };
    return { exists, uri, index, position, item, data } as const;
  },

  click(getCtx: t.RepoListCtxGet, input: ItemInput): t.RepoListClickHandlerArgs {
    const { store, index } = getCtx();
    const { item, position } = WrangleItem.get(getCtx, input);
    return { store, index, position, item: toObject(item) };
  },
} as const;

export const Wrangle = {
  Item: WrangleItem,

  getItem(getCtx: t.RepoListCtxGet, target?: Index | Id) {
    const ctx = getCtx();
    const [item] = Model.List.getItem(ctx.list.state, target || '');
    return item ? WrangleItem.get(getCtx, item) : undefined;
  },

  total(getCtx: t.RepoListCtxGet) {
    const { index, filter } = getCtx();
    return Wrangle.filterDocs(index.doc.current, filter).length;
  },

  filterDocs(index: t.StoreIndex, filter?: t.StoreIndexFilter): t.StoreIndexDoc[] {
    return StoreIndex.filter(index.docs, filter);
  },
} as const;

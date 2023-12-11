import { Data, type ItemInput } from './Data';
import { StoreIndex, rx, toObject, type t } from './common';

export const WrangleItem = {
  $(item: t.RepoItemCtx) {
    const mode = () => Data.item(item).mode;
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

  indexOf(getCtx: t.RepoListCtxGet, input: ItemInput) {
    const ctx = getCtx();
    const data = Data.item(input);
    const docs = Wrangle.filterDocs(ctx.index.doc.current, ctx.filter);
    const index = docs.findIndex((item) => item.uri === data.uri);
    const item = docs[index];
    const exists = index > -1;
    const total = docs.length;
    const position = { index, total };
    return { exists, index, position, item } as const;
  },

  click(getCtx: t.RepoListCtxGet, input: ItemInput): t.RepoListClickHandlerArgs {
    const { store, index } = getCtx();
    const { item, position } = WrangleItem.indexOf(getCtx, input);
    return { store, index, position, item: toObject(item) };
  },
} as const;

export const Wrangle = {
  Item: WrangleItem,

  total(getCtx: t.RepoListCtxGet) {
    const { index, filter } = getCtx();
    return Wrangle.filterDocs(index.doc.current, filter).length;
  },

  filterDocs(index: t.StoreIndexDoc, filter?: t.StoreIndexFilter): t.StoreIndexDocItem[] {
    return StoreIndex.filter(index.docs, filter);
  },
} as const;

import { type t, StoreIndex } from './common';
import { Wrangle } from './u';

/**
 * Behavior that monitors the index looking for redraw ques.
 */
export function listRedrawBehavior(args: { ctx: t.GetRepoListModel; array: t.RepoArray }) {
  const { list, index, dispose$ } = args.ctx();
  const events = index.events(dispose$);

  /**
   * Redraw on renames within the underlying [Index] model.
   */
  events.renamed$.subscribe((e) => {
    const { name, uri } = e.item;
    const { item, index } = wrangle.itemFromUri(args.ctx, uri);
    if (item && item.current.label !== name) {
      item.change((d) => (d.label = name));
      list.dispatch.redraw(index);
    }
  });

  /**
   * Redraw on share change.
   */
  events.shared$.subscribe((e) => {
    const { uri } = e.item;
    const { item, index } = wrangle.itemFromUri(args.ctx, uri);
    if (item) list.dispatch.redraw(index);
  });

  /**
   * Adjust list length on removal.
   */
  events.removed$.subscribe((e) => {
    const { uri } = e.item;
    const arrayIndex = wrangle.arrayIndex(args.array, uri);
    args.array.remove(arrayIndex);
    list.state.change((d) => (d.total = Wrangle.total(args.ctx) + 1));
  });
}

/**
 * Helpers
 */
export const wrangle = {
  indexFromUri(ctx: t.GetRepoListModel, uri: string) {
    const { index, filter } = ctx();
    const docs = StoreIndex.Filter.docs(index.doc.current, filter);
    return docs.findIndex((d) => d.uri === uri);
  },

  itemFromUri(ctx: t.GetRepoListModel, uri: string) {
    const list = ctx().list;
    const index = wrangle.indexFromUri(ctx, uri);
    const item = list.state.current.getItem?.(index)[0];
    return { index, item } as const;
  },

  arrayIndex(array: t.RepoArray, uri: string) {
    return array.items.findIndex((m) => m.current.data?.uri === uri);
  },
} as const;

import { Time, type t } from './common';
import { Wrangle } from './u.Wrangle';
import { Data } from './Data';

/**
 * Behavior that monitors the index looking for redraw ques.
 */
export function listRedrawBehavior(args: { ctx: t.RepoListCtxGet; array: t.RepoArray }) {
  const { list, index, dispose$ } = args.ctx();
  const events = index.events(dispose$);

  /**
   * REDRAW: on renames within the underlying [Index] model.
   */
  events.renamed$.pipe().subscribe((e) => {
    const { name, uri } = e.item;
    const { item, index } = wrangle.itemFromUri(args.ctx, uri);
    if (item && item.current.label !== name) {
      item.change((d) => (d.label = name));
      list.dispatch.redraw(index);
    }
  });

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
  indexFromUri(ctx: t.RepoListCtxGet, uri: string) {
    const { index, filter } = ctx();
    const docs = Wrangle.filterDocs(index.doc.current, filter);
    return docs.findIndex((d) => d.uri === uri);
  },

  itemFromUri(ctx: t.RepoListCtxGet, uri: string) {
    const list = ctx().list;
    const index = wrangle.indexFromUri(ctx, uri);
    const item = list.state.current.getItem?.(index)[0];
    return { index, item } as const;
  },

  arrayIndex(array: t.RepoArray, uri: string) {
    return array.items.findIndex((m) => m.current.data?.uri === uri);
  },
} as const;
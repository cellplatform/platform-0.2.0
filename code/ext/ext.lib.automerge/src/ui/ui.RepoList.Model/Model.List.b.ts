import { Time, rx, type t } from './common';
import { Wrangle } from './u.Wrangle';

/**
 * Behavior that monitors the index looking after the global list.
 */
export function listBehavior(args: { ctx: t.RepoListCtxGet }) {
  const { list, index, filter, dispose$ } = args.ctx();
  const events = { index: index.events(dispose$) } as const;
  const currentTotal = () => Wrangle.filterDocs(index.doc.current, filter).length;

  /**
   * NB: After a new document is added, simply append 1 to the length of the list.
   *     The [getItem] data generator takes care of the rest.
   */
  events.index.added$
    .pipe(rx.filter((e) => e.total !== currentTotal() + 1))
    .subscribe(async (e) => {
      const total = currentTotal();
      list.state.change((d) => (d.total = total + 1)); //    (1) Append new item to list.
      await Time.delay(0, () => list.dispatch.redraw());
      await Time.delay(0, () => list.dispatch.edit(total - 1)); // (2) Start edit.
    });

  /**
   * REDRAW: on renames within the underlying [Index] model.
   */
  events.index.renamed$.pipe().subscribe((e) => {
    const { name } = e.item;
    const docs = Wrangle.filterDocs(index.doc.current, filter);
    const i = docs.findIndex((d) => d.uri === e.item.uri);
    const item = list.state.current.getItem?.(i)[0];
    if (item && item.current.label !== name) {
      item.change((d) => (d.label = name));
      list.dispatch.redraw(i);
    }
  });
}

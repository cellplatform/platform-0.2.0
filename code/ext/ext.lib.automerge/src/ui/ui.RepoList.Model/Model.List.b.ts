import { Time, rx, toObject, type t } from './common';
import { Wrangle } from './u.Wrangle';

/**
 * Behaviors for the list.
 */
export function listBehavior(args: { ctx: t.RepoListCtxGet }) {
  const { list, index, dispose$ } = args.ctx();
  const currentTotal = () => Wrangle.total(args.ctx);
  const events = {
    index: index.events(dispose$),
    list: list.state.events(dispose$),
  } as const;

  /**
   * NB: After a new document is added, simply append 1 to the length of the list.
   *     The [getItem] data generator takes care of the rest.
   */
  events.index.added$
    .pipe(rx.filter((e) => e.total !== currentTotal() + 1))
    .subscribe(async (e) => {
      const focused = list.state.current.focused;
      const total = currentTotal();
      list.state.change((d) => (d.total = total + 1)); // (1) Append new item to list.
      await Time.delay(0, () => list.dispatch.redraw());
      if (focused) list.dispatch.edit(total - 1); // (2) Start edit.
    });

  /**
   * List selection.
   */
  events.list.selected$
    .pipe(
      rx.filter(() => !!args.ctx().handlers.onSelection),
      rx.map((e) => Wrangle.getItem(args.ctx, e)!),
      rx.filter((e) => !!e),
    )
    .subscribe((e) => {
      const { store, index, handlers } = args.ctx();
      const { position } = e;
      const kind = e.data.kind;
      const item = toObject(e.item);
      handlers.onSelection?.({ store, index, position, kind, item });
    });
}

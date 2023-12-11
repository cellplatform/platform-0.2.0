import { rx, toObject, type t } from './common';
import { Wrangle } from './u.Wrangle';

/**
 * Behaviors for the list.
 */
export function listSelectedBehavior(args: { ctx: t.RepoListCtxGet }) {
  const { list, dispose$ } = args.ctx();
  const events = list.state.events(dispose$);

  /**
   * List selection.
   */
  events.selected$
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

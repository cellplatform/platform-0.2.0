import { rx, toObject, type t } from './common';
import { Wrangle } from './u.Wrangle';

/**
 * Behaviors for the list.
 */
export function listSelectionBehavior(args: { ctx: t.RepoListCtxGet }) {
  const { list, dispose$ } = args.ctx();
  const events = list.state.events(dispose$);

  /**
   * Focus / Selection change.
   */
  events.active.$.pipe(
    rx.filter(() => !!args.ctx().handlers.onActiveChanged),
    rx.map((e) => Wrangle.getItem(args.ctx, e.selected)!),
    rx.filter((e) => !!e),
  ).subscribe((e) => {
    const { store, list, index, handlers } = args.ctx();
    const { position } = e;
    const kind = e.data.kind;
    const item = toObject(e.item);
    const focused = list.state.current.focused!;
    handlers.onActiveChanged?.({ store, index, position, kind, item, focused });
  });
}

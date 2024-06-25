import { rx, type t } from './common';

/**
 * Behaviors for the list.
 */
export function listSelectionBehavior(args: { ctx: t.GetRepoListModel }) {
  const model = args.ctx();
  const events = model.events();

  /**
   * Focus / Selection change.
   */
  events.active$
    .pipe(rx.filter(() => !!model.handlers.onActiveChanged))
    .subscribe((e) => model.handlers.onActiveChanged?.(e));
}

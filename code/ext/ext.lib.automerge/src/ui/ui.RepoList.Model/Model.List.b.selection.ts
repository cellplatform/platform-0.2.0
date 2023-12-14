import { rx, type t } from './common';

/**
 * Behaviors for the list.
 */
export function listSelectionBehavior(args: { ctx: t.GetRepoListModel }) {
  const ctx = args.ctx();
  const events = { repo: ctx.events() } as const;

  /**
   * Focus / Selection change.
   */
  events.repo.active$
    .pipe(rx.filter(() => !!ctx.handlers.onActiveChanged))
    .subscribe((e) => ctx.handlers.onActiveChanged?.(e));
}

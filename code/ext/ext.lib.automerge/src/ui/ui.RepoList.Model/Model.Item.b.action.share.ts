import { type t } from './common';
import { Wrangle } from './u.Wrangle';

export function actionShareBehavior(args: { ctx: t.GetRepoListCtx; item: t.RepoItemCtx }) {
  const action$ = Wrangle.Item.$(args.item).action$;

  /**
   * Listener.
   */
  action$('Item:Right', 'Share').subscribe((e) => {
    const ctx = args.ctx();

    // Update the model state.
    const { exists, uri } = Wrangle.Item.get(args.ctx, args.item);
    if (exists) ctx.index.toggleShared(uri);

    // Alert listeners.
    ctx.handlers.onShareClick?.(Wrangle.Item.click(args.ctx, args.item));

    // Finish up.
    args.item.dispatch.redraw();
  });
}

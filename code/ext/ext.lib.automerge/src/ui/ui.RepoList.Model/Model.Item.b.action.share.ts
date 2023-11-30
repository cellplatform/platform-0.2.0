import { StoreIndex, type t } from './common';
import { Wrangle } from './u.Wrangle';

export function actionShareBehavior(args: { ctx: t.RepoListCtxGet; item: t.RepoItemCtx }) {
  const action$ = Wrangle.Item.$(args.item).action$;

  /**
   * Listener.
   */
  action$('Item:Right', 'Share').subscribe((e) => {
    const ctx = args.ctx();
    const { filter } = ctx;

    // Update the model state.
    const { index, exists } = Wrangle.Item.indexOf(args.ctx, args.item);
    if (exists) {
      ctx.index.doc.change((d) => StoreIndex.Mutate.toggleShared(d, index, { filter }));
    }

    // Alert listeners.
    ctx.handlers.onShareClick?.(Wrangle.Item.click(args.ctx, args.item));

    // Finish up.
    args.item.dispatch.redraw();
  });
}

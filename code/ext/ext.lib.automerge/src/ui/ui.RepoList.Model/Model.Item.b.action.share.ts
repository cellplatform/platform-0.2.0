import { rx, type t } from './common';
import { Data } from './Data';
import { Wrangle } from './Wrangle';

export function actionShareBehavior(args: { ctx: t.RepoListCtxGet; item: t.RepoItemCtx }) {
  const action$ = Wrangle.item$(args.item).action$;

  action$('Item:Right', 'Share').subscribe((e) => {
    const ctx = args.ctx();

    // Update the model state.
    const { position, exists } = Data.findIndexOf(args.ctx, args.item);
    if (exists) {
      ctx.index.doc.change((d) => {
        const item = d.docs[position.index];
        if (item) item.shared = !item.shared;
      });
    }

    // Alert listeners.
    ctx.handlers.onShareClick?.(Data.clickArgs(args.ctx, args.item));

    // Finish up.
    args.item.dispatch.redraw();
  });
}

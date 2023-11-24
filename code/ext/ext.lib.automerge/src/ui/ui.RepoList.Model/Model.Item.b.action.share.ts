import { A, type t } from './common';
import { Data } from './Data';
import { Wrangle } from './u.Wrangle';

export function actionShareBehavior(args: { ctx: t.RepoListCtxGet; item: t.RepoItemCtx }) {
  const action$ = Wrangle.item$(args.item).action$;

  const toggleShared = (item: t.RepoIndexDoc) => {
    if (typeof item.shared !== 'object') {
      item.shared = { current: false, count: new A.Counter(0) };
    }
    item.shared.current = !item.shared.current;
    item.shared.count.increment(1);
  };

  /**
   * Listener.
   */
  action$('Item:Right', 'Share').subscribe((e) => {
    const ctx = args.ctx();

    // Update the model state.
    const { position, exists } = Data.findIndexOf(args.ctx, args.item);
    if (exists) {
      ctx.index.doc.change((d) => {
        const item = d.docs[position.index];
        if (item) toggleShared(item);
      });
    }

    // Alert listeners.
    ctx.handlers.onShareClick?.(Data.clickArgs(args.ctx, args.item));

    // Finish up.
    args.item.dispatch.redraw();
  });
}

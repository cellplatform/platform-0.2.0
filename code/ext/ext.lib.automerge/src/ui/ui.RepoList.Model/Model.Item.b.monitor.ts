import { rx, type t } from './common';
import { Data } from './Data';

/**
 * Behavior for handling events.
 */
export function eventMonitorBehavior(args: { ctx: t.RepoListCtxGet; item: t.RepoItemCtx }) {
  const { item } = args;
  const mode = () => Data.item(item.state).mode;

  const edge$ = (action: t.RepoListAction, kind?: t.RepoListActionCtx['kind']) => {
    return item.events.cmd.action.kind(action).pipe(
      rx.filter((e) => mode() === 'Doc'), // NB: defensive guard.
      rx.map((e) => e.ctx as t.RepoListActionCtx),
      rx.filter((e) => (kind ? e.kind === kind : true)),
    );
  };

  /**
   * (Trigger) Listeners.
   */
  edge$('Item:Left').subscribe((e) => {
    const ctx = args.ctx();
    ctx.handlers.onDatabaseClick?.(Data.clickArgs(args.ctx, args.item));
  });

  edge$('Item:Right', 'Share').subscribe((e) => {
    const ctx = args.ctx();

    // Update the model state.
    const { position, exists } = Data.indexItem(args.ctx, args.item);
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

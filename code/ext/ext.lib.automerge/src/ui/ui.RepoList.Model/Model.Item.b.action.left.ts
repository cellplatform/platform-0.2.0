import { type t } from './common';
import { Wrangle } from './u.Wrangle';

export function actionLeftBehavior(args: { ctx: t.GetRepoListCtx; item: t.RepoItemCtx }) {
  const action$ = Wrangle.Item.$(args.item).action$;

  action$('Item:Left').subscribe((e) => {
    const ctx = args.ctx();
    const payload = Wrangle.Item.click(args.ctx, args.item);
    ctx.handlers.onDatabaseClick?.(payload);
  });
}

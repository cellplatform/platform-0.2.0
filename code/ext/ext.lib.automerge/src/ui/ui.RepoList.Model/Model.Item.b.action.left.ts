import { type t } from './common';
import { Data } from './Data';
import { Wrangle } from './Wrangle';

export function actionLeftBehavior(args: { ctx: t.RepoListCtxGet; item: t.RepoItemCtx }) {
  const action$ = Wrangle.item$(args.item).action$;

  action$('Item:Left').subscribe((e) => {
    const ctx = args.ctx();
    const payload = Data.clickArgs(args.ctx, args.item);
    ctx.handlers.onDatabaseClick?.(payload);
  });
}

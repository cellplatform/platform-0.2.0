import { type t } from './common';
import { Wrangle } from './u';

export function actionLeftBehavior(args: { ctx: t.GetRepoListModel; item: t.RepoItemModel }) {
  const action$ = Wrangle.Item.$(args.item).action$;

  action$('Item:Left').subscribe((e) => {
    const ctx = args.ctx();
    const payload = Wrangle.Item.click(args.ctx, args.item);
    ctx.handlers.onDatabaseClick?.(payload);
  });
}

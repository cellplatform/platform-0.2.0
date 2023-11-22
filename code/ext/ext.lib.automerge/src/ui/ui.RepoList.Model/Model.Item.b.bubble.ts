import { rx, toObject, type t } from './common';
import { Data } from './Data';

/**
 * Behavior for handling name edits.
 */
export function eventBubbleBehavior(args: {
  ctx: t.RepoListCtxGet;
  item: t.RepoItemState;
  events: t.RepoItemEvents;
}) {
  const { events } = args;
  const mode = () => Data.item(args.item).mode;

  const edge$ = (action: t.RepoListAction, kind?: t.RepoListActionCtx['kind']) => {
    return events.cmd.action.kind(action).pipe(
      rx.filter((e) => mode() === 'Doc'), // NB: defensive guard.
      rx.map((e) => e.ctx as t.RepoListActionCtx),
      rx.filter((e) => (kind ? e.kind === kind : true)),
    );
  };

  const getArgs = () => {
    const { store, index, handlers } = args.ctx();
    const data = Data.item(args.item);
    const item = index.doc.current.docs.find((item) => item.uri === data.uri);
    const payload = item ? { store, index, item: toObject(item) } : undefined;
    return { payload, handlers } as const;
  };

  /**
   * (Trigger) Listeners.
   */
  edge$('Item:Left').subscribe((e) => {
    const { handlers, payload } = getArgs();
    if (payload) handlers?.onDatabaseClick?.(payload);
  });

  edge$('Item:Right', 'Share').subscribe((e) => {
    const { handlers, payload } = getArgs();
    if (payload) handlers?.onShareClick?.(payload);
  });
}

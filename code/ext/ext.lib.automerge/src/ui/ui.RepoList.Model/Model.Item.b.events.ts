import { rx, toObject, type t } from './common';
import { Data } from './Data';

/**
 * Behavior for handling events.
 */
export function eventsBehavior(args: {
  ctx: t.RepoListCtxGet;
  item: t.RepoItemState;
  events: t.RepoItemEvents;
}) {
  const { events, item } = args;
  const mode = () => Data.item(args.item).mode;

  const edge$ = (action: t.RepoListAction, kind?: t.RepoListActionCtx['kind']) => {
    return events.cmd.action.kind(action).pipe(
      rx.filter((e) => mode() === 'Doc'), // NB: defensive guard.
      rx.map((e) => e.ctx as t.RepoListActionCtx),
      rx.filter((e) => (kind ? e.kind === kind : true)),
    );
  };

  const getItem = () => {
    const { index } = args.ctx();
    const data = Data.item(args.item);
    const docs = index.doc.current.docs;
    const i = docs.findIndex((item) => item.uri === data.uri);
    const item = index.doc.current.docs[i];
    return { item, i, index, total: docs.length };
  };

  const getClickArgs = () => {
    const { store, index, handlers } = args.ctx();
    const { i, item, total } = getItem();
    const event: t.RepoListClickHandlerArgs = {
      store,
      index,
      position: { index: i, total },
      item: toObject(item),
    };
    return { handlers, index, event };
  };

  /**
   * (Trigger) Listeners.
   */
  edge$('Item:Left').subscribe((e) => {
    const res = getClickArgs();
    if (res) res.handlers.onDatabaseClick?.(res.event);
  });

  edge$('Item:Right', 'Share').subscribe((e) => {
    const { i, index } = getItem();

    if (i > -1) {
      index.doc.change((d) => {
        const item = d.docs[i];
        if (item) item.shared = !item.shared;
      });
    }

    const res = getClickArgs();
    if (res) res.handlers.onShareClick?.(res.event);

    // if (payload) {
    //   item.change((d) => {
    //     const data = Data.item(d);
    //     // data.
    //   });
    //   handlers?.onShareClick?.(payload);
    // }
  });
}

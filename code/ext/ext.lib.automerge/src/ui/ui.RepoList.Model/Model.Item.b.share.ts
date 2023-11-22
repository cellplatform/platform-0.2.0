import { rx, toObject, type t } from './common';
import { Data } from './Data';

/**
 * Behavior for handling name edits.
 */
export function shareBehavior(args: {
  ctx: t.RepoListCtxGet;
  item: t.RepoItemState;
  events: t.RepoItemEvents;
}) {
  const { events } = args;

  /**
   * (Trigger) Listener
   */
  const mode = () => Data.item(args.item).mode;
  events.cmd.action
    .kind('Item:Right')
    .pipe(
      rx.filter((e) => e.focused && e.selected),
      rx.filter((e) => mode() === 'Doc'), // NB: defensive guard
      rx.map((e) => e.ctx as t.RepoListActionCtx),
      rx.filter((e) => e.kind === 'Share'),
    )
    .subscribe((e) => {
      const data = Data.item(args.item);
      const { store, index, handlers } = args.ctx();
      const item = index.doc.current.docs.find((item) => item.uri === data.uri);
      if (item) handlers.onShareClick?.({ store, index, item: toObject(item) });
    });
}

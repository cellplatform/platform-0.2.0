import { rx, type t } from './common';
import { Data } from './Data';

/**
 * Behavior for handling name edits.
 */
export function shareBehavior(args: {
  ctx: t.RepoListCtxGet;
  item: t.RepoItemState;
  events: t.RepoItemEvents;
}) {
  const { events, item } = args;

  /**
   * (Trigger) Listener
   */
  const mode = () => Data.item(item).mode;

  events.cmd.action
    .kind('Item:Right')
    .pipe(
      rx.filter((e) => e.focused && e.selected),
      rx.map((e) => e.ctx as t.RepoListActionCtx),
      rx.filter((e) => e.kind === 'Share'),
    )
    .subscribe((e) => {
    });
}

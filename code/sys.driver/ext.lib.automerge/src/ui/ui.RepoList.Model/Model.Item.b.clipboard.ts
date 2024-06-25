import { rx, type t } from './common';
import { Data, State } from './u';

/**
 * Behavior for handling "copy" operations on a repo item.
 */
export function clipboardBehavior(args: { ctx: t.GetRepoListModel; item: t.RepoItemModel }) {
  const { item } = args;
  const { list, dispose$ } = args.ctx();

  const events = {
    list: list.state.events(dispose$),
    item: item.events,
  } as const;

  const is = {
    get doc() {
      return Data.item(item).kind === 'Doc';
    },
    get copyable() {
      return is.doc && args.ctx().behaviors.includes('Copyable');
    },
  } as const;

  /**
   * (Handlers)
   */

  const copyToClipboard = async () => {
    if (!is.copyable) return;

    const uri = Data.item(item).uri;
    const id = Data.Uri.id(uri);
    const text = id ? `crdt:automerge:${id}` : 'ERROR: URI of CRDT document not found';
    await navigator.clipboard.writeText(text);

    const message = State.message.set(item, 'copied uri', { icon: 'Tick' });
    clearMessage$.pipe(rx.take(1)).subscribe(() => message.clear());
  };

  /**
   * (Listen)
   */
  const deselected$ = events.list.item(item.state.instance).selected$.pipe(rx.filter((e) => !e));
  const clearMessage$ = rx.merge(deselected$, events.item.key.escape$);
  events.item.cmd.clipboard.copy$.pipe(rx.filter(() => is.copyable)).subscribe(copyToClipboard);
  events.item.cmd.action
    .kind('Item:Left')
    .pipe(rx.filter(() => is.copyable))
    .subscribe(copyToClipboard);
}

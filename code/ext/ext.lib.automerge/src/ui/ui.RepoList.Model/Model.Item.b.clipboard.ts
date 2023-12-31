import { rx, type t } from './common';
import { Data } from './Data';

/**
 * Behavior for handling "copy" operations on a repo item.
 */
export function clipboardBehavior(args: { ctx: t.GetRepoListModel; item: t.RepoItemModel }) {
  const { item } = args;
  const events = { item: item.events } as const;
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
    const text = id || 'ERROR: URI of CRDT document not found';
    await navigator.clipboard.writeText(text);

    /**
     * TODO 🐷 show "(copied)" message on time delay.
     */
    console.log('copied to clipboard:', text);
  };

  /**
   * (Listen)
   */
  events.item.cmd.clipboard.copy$.pipe(rx.filter(() => is.copyable)).subscribe(copyToClipboard);
  events.item.cmd.action
    .kind('Item:Left')
    .pipe(rx.filter(() => is.copyable))
    .subscribe(copyToClipboard);
}

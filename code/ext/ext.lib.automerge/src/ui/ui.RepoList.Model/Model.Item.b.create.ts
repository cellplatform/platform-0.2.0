import { rx, type t } from './common';
import { Data } from './Data';

/**
 * Behavior for adding a new document to the repo.
 */
export function createBehavior(args: { ctx: t.RepoListCtxGet; item: t.RepoItemCtx }) {
  const { item } = args;

  /**
   * Add a new document to the repo.
   */
  const add = async () => {
    // Generate a new document.
    // NB: the addition of a new item to the list is handed in the [listBehavior].
    const { store } = args.ctx();
    await store.doc.getOrCreate((d) => ({}));
    item.dispatch.edit('start'); // NB: ensure editing mode.
  };

  /**
   * (Trigger) Listener.
   */
  const mode = () => Data.item(item.state).mode;
  const addModeFilter = rx.filter(() => mode() === 'Add');
  item.events.key.enter$.pipe(addModeFilter).subscribe(add);
  item.events.cmd.action.kind('Item:Left').pipe(addModeFilter).subscribe(add);
  item.events.cmd.click$
    .pipe(rx.filter((e) => mode() === 'Add'))
    .pipe(rx.filter((e) => e.kind === 'Double'))
    .pipe(rx.filter((e) => e.target === 'Item'))
    .subscribe(add);
}

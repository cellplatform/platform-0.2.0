import { rx, type t } from './common';
import { Data } from './Data';

/**
 * Behavior for adding a new document to the repo.
 */
export function newBehavior(args: { ctx: t.GetRepoListModel; item: t.RepoItemModel }) {
  const { item } = args;

  /**
   * Add a new document to the repo.
   */
  const add = async () => {
    // Generate a new empty document.
    // NB: The addition of a new item to the list-total and setting
    //     to "edit mode" is handed in the [list-behavior] controller.
    const { store } = args.ctx();
    await store.doc.getOrCreate<unknown>((d) => ({}));
  };

  /**
   * (Trigger) Listener.
   */
  const mode = () => Data.item(item.state).kind;
  const addModeFilter = rx.filter(() => mode() === 'Add');
  item.events.key.enter$.pipe(addModeFilter).subscribe(add);
  item.events.cmd.action.kind('Item:Left').pipe(addModeFilter).subscribe(add);
  item.events.cmd.click$
    .pipe(
      rx.filter((e) => mode() === 'Add'),
      rx.filter((e) => e.kind === 'Double' && e.target === 'Item'),
    )
    .subscribe(add);
}

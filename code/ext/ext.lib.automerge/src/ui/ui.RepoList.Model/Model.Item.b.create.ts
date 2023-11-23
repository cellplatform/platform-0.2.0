import { Model, rx, type t } from './common';
import { Data } from './Data';

/**
 * Behavior for adding a new document to the repo.
 */
export function createDocumentBehavior(args: {
  ctx: t.RepoListCtxGet;
  item: t.RepoItemState;
  events: t.RepoItemEvents;
}) {
  const { ctx, events, item } = args;
  const { list, store, index } = ctx();
  const indexEvents = index.events(events.dispose$);
  const dispatch = {
    item: Model.Item.commands(item),
    list: list.dispatch,
  } as const;

  /**
   * Add a new document to the repo.
   */
  const add = async () => {
    // Generate a new document.
    // NB: the addition of a new item to the list is handed in the [listBehavior].
    await store.doc.getOrCreate((d) => ({}));
    dispatch.item.edit('start'); // NB: ensure editing mode.
  };

  /**
   * (Trigger) Listener.
   */
  const mode = () => Data.item(item).mode;
  const addModeFilter = rx.filter(() => mode() === 'Add');
  events.key.enter$.pipe(addModeFilter).subscribe(add);
  events.cmd.action.kind('Item:Left').pipe(addModeFilter).subscribe(add);
  events.cmd.click$
    .pipe(rx.filter((e) => mode() === 'Add'))
    .pipe(rx.filter((e) => e.kind === 'Double'))
    .pipe(rx.filter((e) => e.target === 'Item'))
    .subscribe(add);
}

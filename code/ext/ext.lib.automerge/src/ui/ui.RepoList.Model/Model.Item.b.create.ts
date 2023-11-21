import { Model, rx, Time, type t } from './common';
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
  const { list, store } = ctx();
  const dispatch = {
    item: Model.Item.commands(item),
    list: list.dispatch,
  } as const;

  /**
   * Add a new document to the repo.
   */
  const add = async () => {
    // Generate a new document.
    await store.doc.getOrCreate((d) => ({}));

    // NB: After creating the new document, simply append 1 to the length of the list.
    //     The [getItem] data generator takes care of the rest.
    list.state.change((d) => (d.total += 1));
    dispatch.item.redraw();
    Time.delay(0, () => {
      dispatch.item.edit('start'); // NB: ensure editing mode.
    });
  };

  /**
   * (Trigger) Listener
   */
  const mode = () => Data.item(item).mode;
  const addModeFilter = rx.filter(() => mode() === 'Add');
  events.key.enter$.pipe(addModeFilter).subscribe(add);
  events.cmd.action.kind('Store:Left').pipe(addModeFilter).subscribe(add);
  events.cmd.click$
    .pipe(rx.filter((e) => mode() === 'Add'))
    .pipe(rx.filter((e) => e.kind === 'Double'))
    .pipe(rx.filter((e) => e.target === 'Item'))
    .subscribe(add);
}

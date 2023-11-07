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
  const { list, store } = ctx();
  const dispatch = Model.Item.commands(item);

  /**
   * Add a new document to the repo.
   */
  const add = async () => {
    const doc = await store.doc.findOrCreate<T>((d) => ({ tmp: 0 }));

    item.change((d) => {
      const data = Data.item(d);
      data.mode = 'Doc';
      data.uri = doc.uri;
      d.label = '';
      d.editable = true;
    });
    dispatch.redraw();

    list.change((d) => (d.total += 1));
    dispatch.redraw();
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

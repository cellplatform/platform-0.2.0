import { DEFAULTS, rx, slug, Time, type t } from './common';
import { Data } from './Data';
import { Wrangle } from './u.Wrangle';

/**
 * Behavior for deleting a document.
 */
export function deleteBehavior(args: { ctx: t.GetRepoListModel; item: t.RepoItemModel }) {
  const { ctx, item } = args;
  const { index, list, dispose$ } = ctx();
  const action$ = Wrangle.Item.$(args.item).action$;
  const redraw = item.dispatch.redraw;
  const getData = () => Data.item(item.state);
  const timer = Time.action(DEFAULTS.timeout.delete).on('complete', () => Delete.reset());

  const events = {
    list: list.state.events(dispose$),
    item: item.events,
  } as const;

  let tx = '';
  const Delete = {
    is: {
      get pending() {
        const data = getData();
        return !!(data.pending && data.pending.tx === tx);
      },
    },

    pending() {
      if (Delete.is.pending) return timer.start(); // NB: already running...restart timer.
      timer.start();
      tx = slug();
      item.state.change((d) => (Data.item(d).pending = { tx, action: 'Delete' }));
      redraw();
    },

    reset() {
      if (!Delete.is.pending) return;
      tx = '';
      item.state.change((d) => (Data.item(d).pending = undefined));
      redraw();
    },

    /**
     * TODO 🐷
     * - archive concept (rather than had delete)
     */
    invoke() {
      const uri = getData().uri;
      if (!Delete.is.pending || !uri) return;

      // Delete the item from the [Index].
      const { position } = Wrangle.Item.get(ctx, item);
      const { focused } = list.state.current;
      index.remove(uri);

      // Reset state of list.
      list.dispatch.select(position.index);
      if (focused) Time.delay(0, list.dispatch.focus);
    },
  } as const;

  /**
   * Listen.
   */
  const on = (...codes: string[]) => {
    return events.item.key.$.pipe(
      rx.filter((e) => codes.includes(e.code)),
      rx.map((e) => ({ data: getData(), key: e })),
      rx.filter((e) => e.data.kind === 'Doc'),
    );
  };

  const filter = {
    pending: rx.filter((e) => Delete.is.pending),
    notPending: rx.filter((e) => !Delete.is.pending),
  } as const;
  const supressEdit$ = item.events.cmd.edit$.pipe(rx.filter((e) => Delete.is.pending));
  const selected$ = events.list.item(item.state.instance).selected$;
  const deselected$ = selected$.pipe(rx.filter((e) => !e)).pipe(filter.pending);
  const initiate$ = on('Delete', 'Backspace');
  const enterKey$ = on('Enter').pipe(filter.pending);
  const escapeKey$ = on('Escape').pipe(filter.pending);
  const buttonClick$ = action$('Item:Right', 'Delete');
  const execute$ = rx.merge(enterKey$, buttonClick$).pipe(filter.pending);

  supressEdit$.subscribe((e) => e.cancel()); // NB: Supress the start edit operation (from ENTER key) while pending.
  rx.merge(escapeKey$, deselected$).subscribe(Delete.reset);
  initiate$.subscribe(Delete.pending);
  execute$.subscribe(Delete.invoke);
}

import { DEFAULTS, rx, slug, Time, type t } from './common';
import { Data } from './Data';
import { Wrangle } from './u.Wrangle';

/**
 * Behavior for deleting a document.
 */
export function deleteBehavior(args: { ctx: t.RepoListCtxGet; item: t.RepoItemCtx }) {
  const { ctx, item } = args;
  const { index, list } = ctx();
  const action$ = Wrangle.Item.$(args.item).action$;
  const redraw = item.dispatch.redraw;
  const getData = () => Data.item(item.state);

  const timer = Time.action(DEFAULTS.timeout.delete, (e) => {
    if (e.action === 'complete') Delete.reset();
  });

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

    execute() {
      /**
       * TODO 🐷
       */

      console.log('execute', '⚡️💦🐷🌳 🧨🌼✨🧫 👋🧠⚠️💥👁️ ↑↓←→');
    },
  } as const;

  /**
   * Listen.
   */

  const on = (...codes: string[]) => {
    return item.events.key.$.pipe(
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
  const initiate$ = on('Delete', 'Backspace');
  const enterKey$ = on('Enter').pipe(filter.pending);
  const escapeKey$ = on('Escape').pipe(filter.pending);
  const buttonClick$ = action$('Item:Right', 'Delete');
  const execute$ = rx.merge(enterKey$, buttonClick$).pipe(rx.filter((e) => Delete.is.pending));

  initiate$.subscribe(Delete.pending);
  escapeKey$.subscribe(Delete.reset);
  execute$.subscribe(Delete.execute);
  supressEdit$.subscribe((e) => e.cancel()); // NB: Supress the start edit operation (from ENTER key) while pending.

   */
}

import { DEFAULTS, rx, slug, Time, type t } from './common';
import { Data } from './Data';
import { Wrangle } from './u.Wrangle';

type Args = { ctx: t.GetRepoListModel; item: t.RepoItemModel };

/**
 * Behavior for deleting a document.
 */
export function deleteBehavior(args: Args) {
  const { ctx, item } = args;
  const { store, index, list, dispose$ } = ctx();
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
      const uri = getData().uri;
      if (!uri) return;
      if (Delete.is.pending) return timer.start(); // NB: already running...restart timer.

      // Fire before-event.
      const cancelled = Fire.beforeEvent(args);
      if (cancelled) return;

      // Put into pending delete mode.
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

    async invoke() {
      const uri = getData().uri;
      if (!Delete.is.pending || !uri) return;

      const { position } = Wrangle.Item.get(ctx, item);
      const { focused } = list.state.current;

      // Delete the item from the [Index].
      await store.doc.delete(uri);
      Time.delay(0, () => list.dispatch.select(position.index, focused));

      // Fire after-event.
      Fire.afterEvent(args);
    },
  } as const;

  /**
   * Listen.
   */
  const on = (codes: string[], options: { handled?: boolean } = {}) => {
    const $ = events.item.key.$.pipe(
      rx.filter((e) => codes.includes(e.code)),
      rx.filter(() => ctx().behaviors.includes('Deletable')),
      rx.map((e) => ({ data: getData(), key: e })),
      rx.filter((e) => e.data.kind === 'Doc'),
    );
    if (options.handled) $.subscribe((e) => e.key.handled());
    return $;
  };

  const is = Delete.is;
  const supressEdit$ = item.events.cmd.edit$.pipe(rx.filter((e) => is.pending));
  const selected$ = events.list.item(item.state.instance).selected$;
  const deselected$ = selected$.pipe(rx.filter((e) => !e)).pipe(rx.filter((e) => is.pending));
  const initiate$ = on(['Delete', 'Backspace']);
  const enterKey$ = on(['Enter'], { handled: true }).pipe(rx.filter((e) => is.pending));
  const escapeKey$ = on(['Escape']).pipe(rx.filter((e) => is.pending));
  const buttonClick$ = action$('Item:Right', 'Delete');
  const execute$ = rx.merge(enterKey$, buttonClick$).pipe(rx.filter((e) => is.pending));

  supressEdit$.subscribe((e) => e.cancel()); // NB: Supress the start edit operation (from ENTER key) while pending.
  escapeKey$.subscribe(Delete.reset);
  deselected$.subscribe(Delete.reset);
  initiate$.subscribe(Delete.pending);
  execute$.subscribe(Delete.invoke);
}

/**
 * Helpers
 */
type E = t.RepoListCmdEvent;
const Fire = {
  base(args: Args): t.RepoListDeletedEventArgs {
    const { store, index } = args.ctx();
    const { position } = Wrangle.Item.get(args.ctx, args.item);
    const uri = Data.item(args.item.state).uri ?? '';
    return { uri, store, index, position };
  },

  beforeEvent(args: Args) {
    const { list } = args.ctx();
    let cancelled = false;
    list.dispatch.cmd<E>({
      type: 'crdt:RepoList:active/deleting',
      payload: {
        ...Fire.base(args),
        get cancelled() {
          return cancelled;
        },
        cancel: () => (cancelled = true),
      },
    });
    return cancelled;
  },

  afterEvent(args: Args) {
    const { list } = args.ctx();
    list.dispatch.cmd<E>({
      type: 'crdt:RepoList:active/deleted',
      payload: Fire.base(args),
    });
  },
} as const;

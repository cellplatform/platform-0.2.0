import { DEFAULTS, rx, type t } from './common';
import { Path, Tx } from './u';
import { EventsIs as Is } from './u.Events.Is';

type Args = {
  instance: string;
  doc?: t.Lens | t.DocRef;
  paths?: t.CmdBarPaths;
};

/**
 * Strongly typed events for an abstract CRDT document that has
 * paths within it representing a <CmdBar>.
 */
export const Events = {
  Is,

  /**
   * Events factory.
   */
  create(args: Args): t.CmdBarEvents {
    const { distinctWhile, filter, map } = rx;
    const { instance, paths = DEFAULTS.paths } = args;
    const resolve = Path.resolver(paths);

    const life = rx.lifecycle();
    const { dispose, dispose$ } = life;

    /**
     * Observables.
     */
    const $$ = rx.subject<t.CmdBarEvent>();
    const $ = $$.pipe(rx.takeUntil(dispose$));
    const fire = (e: t.CmdBarEvent) => $$.next(e);

    const text$ = rx.payload<t.CmdBarTextChangedEvent>($, 'crdt:cmdbar/TextChanged');
    const cmd$ = rx.payload<t.CmdBarTxEvent>($, 'crdt:cmdbar/Tx');

    if (args.doc) {
      const events = args.doc.events(dispose$);
      const $ = events.changed$.pipe(
        map((e) => ({ patches: e.patches, doc: resolve.doc(e.after) })),
      );

      // Text:Changed
      $.pipe(
        filter((e) => Events.Is.textChange(paths, e.patches)),
        distinctWhile((p, n) => p.doc.text === n.doc.text),
      ).subscribe((e) => {
        const text = e.doc.text;
        fire({ type: 'crdt:cmdbar/TextChanged', payload: { text } });
      });

      // Tx:(Command)
      $.pipe(
        filter((e) => Events.Is.txChange(paths, e.patches)),
        distinctWhile((p, n) => p.doc.tx === n.doc.tx),
      ).subscribe((e) => {
        const text = e.doc.text;
        const tx = e.doc.tx;
        const parsed = Tx.parse(tx);
        if (parsed.ok) {
          const cmd = parsed.cmd as t.CmdBarAction;
          const is = { self: parsed.instance === instance };
          fire({ type: 'crdt:cmdbar/Tx', payload: { tx, text, cmd, is } });
        }
      });
    }

    /**
     * API
     */
    const api: t.CmdBarEvents = {
      $,
      text$,
      cmd: {
        $: cmd$,
        invoked$: cmd$.pipe(rx.filter((e) => e.cmd === 'Invoke')),
      },

      // Lifecycle.
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    } as const;
    return api;
  },
} as const;

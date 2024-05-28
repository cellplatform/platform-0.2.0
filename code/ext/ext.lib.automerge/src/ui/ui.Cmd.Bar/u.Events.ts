import { Cmd, DEFAULTS, rx, type t } from './common';
import { Path } from './u';
import { EventsIs } from './u.Events.Is';

type Args = {
  instance?: string;
  doc?: t.Lens | t.DocRef;
  paths?: t.CmdBarPaths;
  dispose$?: t.UntilObservable;
};

/**
 * Strongly typed events for an abstract CRDT document that has
 * paths within it representing a <CmdBar>.
 */
export const Events = {
  Is: EventsIs,

  /**
   * <Cmd> object factory for the given document.
   */
  cmd(doc: t.Lens | t.DocRef, paths: t.CmdBarPaths = DEFAULTS.paths) {
    return Cmd.create<t.CmdBarType>(doc, paths.cmd);
  },

  /**
   * Events factory.
   */
  create(args: Args): t.CmdBarEvents {
    const { distinctWhile, filter, map } = rx;
    const { instance = '', paths = DEFAULTS.paths } = args;
    const resolve = Path.resolver(paths);

    const life = rx.lifecycle(args.dispose$);
    const { dispose, dispose$ } = life;

    /**
     * Observables.
     */
    const $$ = rx.subject<t.CmdBarEvent>();
    const $ = $$.pipe(rx.takeUntil(dispose$));
    const fire = (e: t.CmdBarEvent) => $$.next(e);

    const text$ = rx.payload<t.CmdBarTextEvent>($, 'crdt:cmdbar/Text');
    const cmd$ = rx.payload<t.CmdBarTxEvent>($, 'crdt:cmdbar/Tx');

    let cmd: t.CmdBarCmd | undefined;
    if (args.doc) {
      cmd = Events.cmd(args.doc, paths);
      const events = {
        doc: args.doc.events(dispose$),
        cmd: cmd.events(dispose$),
      } as const;

      const $ = events.doc.changed$.pipe(
        map((e) => ({ patches: e.patches, text: resolve.text(e.after) })),
      );

      // Text:Changed
      $.pipe(
        filter((e) => Events.Is.textChange(paths, e.patches)),
        distinctWhile((p, n) => p.text === n.text),
      ).subscribe((e) => fire({ type: 'crdt:cmdbar/Text', payload: { text: e.text } }));

      // Tx:(Command)
      events.cmd.tx$.subscribe((payload) => fire({ type: 'crdt:cmdbar/Tx', payload }));
    }

    /**
     * API
     */

    const api: t.CmdBarEvents = {
      instance,
      text$,
      cmd: {
        $: cmd$,
        invoked$: cmd$.pipe(
          rx.filter((e) => e.name === 'Invoke'),
          rx.map((e) => e as t.CmdBarInvokeTx),
        ),
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

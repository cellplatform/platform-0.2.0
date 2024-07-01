import { rx, slug, type t } from '../common';
import { Is } from './Is';

const DEFAULTS = {
  MAIN: 'Main',
};

type Id = string;

/**
 * And [EventPump] that ferries "Network Message" events between an
 * event-bus and the W3C [WebWorker] mechanics.
 *
 * REFS:
 *   - https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
 *
 */
export const WorkerPump = {
  /**
   * Create a new pump within the [Main] window thread.
   */
  main(args: {
    worker: t.WorkerInstance;
    bus: t.EventBus<any>;
    dispose$?: t.Observable<any>;
  }): t.WorkerPump {
    const { worker, bus, dispose$ } = args;
    const id = DEFAULTS.MAIN;
    const message$ = new rx.Subject<MessageEvent>();
    const originalOnMessage = args.worker.onmessage;
    args.worker.onmessage = (e) => {
      if (originalOnMessage) originalOnMessage.call(worker as any, e);
      message$.next(e);
    };
    return monitor({ id, bus, dispose$, message$, post: (e) => worker.postMessage(e) });
  },

  /**
   * Create a new pump within a [Worker] thread.
   */
  worker(args: {
    ctx: t.WorkerSelf;
    bus: t.EventBus<any>;
    dispose$?: t.Observable<any>;
  }): t.WorkerPump {
    const { ctx, bus, dispose$ } = args;
    const id = (ctx.name || '').trim();

    if (!Is.worker(ctx)) throw new Error(`Worker context not specified`);
    if (!id) throw new Error(`Workers must have an id (no "name" value found)`);
    if (id === DEFAULTS.MAIN) throw new Error(`Worker name (id) cannot be "Main"`);

    const message$ = new rx.Subject<MessageEvent>();
    ctx.addEventListener('message', (message) => message$.next(message));
    return monitor({ id, bus, dispose$, message$, post: (e) => ctx.postMessage(e) });
  },

  /**
   * Meta
   */
  is: Is,
};

/**
 * Helpers
 */

function monitor(args: {
  id: string;
  bus: t.EventBus<any>;
  post: (e: t.NetworkMessageEvent) => void;
  message$: t.Observable<MessageEvent>;
  dispose$?: t.Observable<any>;
}): t.WorkerPump {
  const { id, bus } = args;
  const { dispose, dispose$ } = rx.disposable(args.dispose$);
  let _disposed = false;
  dispose$.subscribe(() => (_disposed = true));

  /**
   * INCOMING message from outside worker.
   */
  args.message$
    .pipe(
      rx.takeUntil(dispose$),
      rx.map((e) => e.data as t.NetworkMessageEvent),
      rx.filter((e) => Is.messageEvent(e)),
      rx.filter((e) => (typeof e.payload.target === 'string' ? e.payload.target === id : true)),
    )
    .subscribe((e) => {
      bus.fire(e);
    });

  /**
   * OUTGOING message from "local" bus - post out to the Worker host
   */
  rx.event<t.NetworkMessageEvent>(bus.$, 'sys.net/msg')
    .pipe(
      rx.takeUntil(dispose$),
      rx.filter((e) => e.payload.sender === id), // NB: Ensure only sending messages from this events originating on this context.
    )
    .subscribe((e) => {
      args.post(e);
    });

  /**
   * Fire an [event] within a [NetworkMessage] envelope event.
   */
  const fire = (event: t.Event, options: { tx?: Id; target?: Id } = {}) => {
    const { tx = slug(), target } = options;
    const e: t.NetworkMessageEvent = {
      type: 'sys.net/msg',
      payload: { tx, sender: id, target, event },
    };
    bus.fire(e);
    return e;
  };

  /**
   * API.
   */
  return { id, dispose, dispose$, fire };
}

import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { rx, slug, t } from '../common/index.mjs';

const MAIN = 'Main';

type Id = string;
type CtxWorker = {
  name: string;
  addEventListener: Worker['addEventListener'];
  postMessage: Worker['postMessage'];
};

type WorkerPump = t.Disposable & {
  id: Id;
  fire(event: t.Event, options?: { tx?: Id; target?: Id }): t.NetworkMessageEvent;
};

const Is = {
  main(self: any) {
    return self.window === self && self.document;
  },
  worker(self: any) {
    return self.self === self && !self.window;
  },
  messageEvent(data: any) {
    const type: t.NetworkMessageEvent['type'] = 'sys.net/msg';
    if (typeof data !== 'object') return false;
    if (data.type !== type) return false;
    if (typeof data.payload.sender !== 'string') return false;
    if (typeof data.payload.tx !== 'string') return false;
    return rx.isEvent(data.payload.event);
  },
};

/**
 * And [EventPump] that ferries "Network Message" events between an
 * event-bus and the WebWorker mechanics.
 *
 * REFS:
 *   - https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
 *
 */
export const WorkerPump = {
  Is,

  /**
   * Create a new pump within the [Main] window thread.
   */
  main(args: { worker: Worker; bus: t.EventBus<any>; dispose$?: t.Observable<any> }): t.WorkerPump {
    const { worker, bus, dispose$ } = args;
    const id = MAIN;
    const message$ = new Subject<MessageEvent>();
    args.worker.onmessage = (e) => message$.next(e);
    return monitor({ id, bus, dispose$, message$, post: (e) => worker.postMessage(e) });
  },

  /**
   * Create a new pump within a [Worker] thread.
   */
  worker(args: {
    ctx: CtxWorker;
    bus: t.EventBus<any>;
    dispose$?: t.Observable<any>;
  }): t.WorkerPump {
    const { ctx, bus, dispose$ } = args;
    const id = (ctx.name || '').trim();

    if (!Is.worker(ctx)) throw new Error(`Worker context not specified`);
    if (!id) throw new Error(`Workers must have an id (no "name" value found)`);
    if (id === MAIN) throw new Error(`Worker name (id) cannot be "Main"`);

    const message$ = new Subject<MessageEvent>();
    ctx.addEventListener('message', (message) => message$.next(message));
    return monitor({ id, bus, dispose$, message$, post: (e) => ctx.postMessage(e) });
  },
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
      takeUntil(dispose$),
      map((e) => e.data as t.NetworkMessageEvent),
      filter((e) => Is.messageEvent(e)),
      filter((e) => (typeof e.payload.target === 'string' ? e.payload.target === id : true)),
    )
    .subscribe((e) => {
      bus.fire(e);
    });

  /**
   * OUTGOING message from "local" bus - post out to the Worker host
   */
  rx.event<t.NetworkMessageEvent>(bus.$, 'sys.net/msg')
    .pipe(
      takeUntil(dispose$),
      filter((e) => e.payload.sender === id), // NB: Ensure only sending messages from this events originating on this context.
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

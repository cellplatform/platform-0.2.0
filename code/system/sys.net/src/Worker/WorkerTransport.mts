import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { t, rx, slug } from '../common/index.mjs';

type Id = string;

type MsgHandler = (e: MessageEvent) => any;

type Ctx = { postMessage: Worker['postMessage'] };
type CtxMain = Ctx & { onmessage: MsgHandler };
type CtxWorker = Ctx & { addEventListener: (type: 'message', handler: MsgHandler) => void };

/**
 * Sets up an [EventBus] based transport betweek [WebWorker] processes.
 */
export function WorkerTransport(args: {
  ctx: t.WorkerGlobal;
  bus: t.EventBus<any>;
  dispose$?: Observable<any>;
}) {
  const { ctx } = args;
  const { dispose, dispose$ } = rx.disposable(args.dispose$);
  const bus = args.bus as t.EventBus<t.NetworkMessageEvent>;
  const id = ctx.name;

  let _isDisposed = false;
  dispose$.subscribe(() => (_isDisposed = true));

  /**
   * INCOMING message
   */
  ctx.addEventListener('message', (e) => {
    if (_isDisposed) return;
    if (!isNetworkMessage(e.data)) return;

    const event = e.data as t.NetworkMessageEvent;
    const payload = event.payload;

    if (typeof payload.target === 'string' && payload.target !== id) return;
    bus.fire(event);
  });

  function isNetworkMessage(data: any) {
    const type: t.NetworkMessageEvent['type'] = 'sys.net/msg';
    if (typeof data !== 'object') return false;
    if (data.type !== type) return false;
    if (typeof data.payload.sender !== 'string') return false;
    if (typeof data.payload.tx !== 'string') return false;
    return rx.isEvent(data.payload.event);
  }

  /**
   * OUTGOING
   */
  bus.$.pipe(
    takeUntil(dispose$),
    filter((e) => e.type === 'sys.net/msg'),
    filter((e) => e.payload.sender === id),
  ).subscribe((e) => {
    ctx.postMessage(e);
  });

  const api = {
    id,
    dispose,
    dispose$,
    fire(event: t.Event, options: { tx?: Id; target?: Id } = {}) {
      const { tx = slug(), target } = options;
      const sender = id;
      const e: t.NetworkMessageEvent = {
        type: 'sys.net/msg',
        payload: { tx, sender, target, event },
      };
      bus.fire(e);
      return e;
    },
  };

  return api;
}

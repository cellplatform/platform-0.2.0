import { WebRtcUtil, rx, slug, type t } from './common';

const DEFAULT = { timeout: 1000 };

type Id = string;
type Args = {
  bus: t.EventBus<any>;
  peer: t.PeerId | t.Peer;
  filter?: (e: t.WebRtcEvent) => boolean;
  dispose$?: t.Observable<any>;
};

/**
 * Event API.
 */
export function init(args: Args): t.WebRtcEvents {
  let _isDisposed = false;
  const { dispose, dispose$ } = rx.disposable(args.dispose$);
  dispose$.subscribe(() => (_isDisposed = true));

  const bus = rx.busAsType<t.WebRtcEvent>(args.bus);
  const instance = Wrangle.id(args);
  const local = instance;

  const $ = bus.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => is.instance(e, instance)),
    rx.filter((e) => args.filter?.(e) ?? true),
  );

  /**
   * Base information about the module.
   */
  const info: t.WebRtcEvents['info'] = {
    req$: rx.payload<t.WebRtcInfoReqEvent>($, 'sys.net.webrtc/info:req'),
    res$: rx.payload<t.WebRtcInfoResEvent>($, 'sys.net.webrtc/info:res'),
    async fire(options = {}) {
      const { timeout = DEFAULT.timeout } = options;
      const tx = slug();
      const op = 'info';
      const res$ = info.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.WebRtcInfoResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.net.webrtc/info:req',
        payload: { tx, instance },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, error };
    },

    async get(options = {}) {
      const res = await info.fire(options);
      return res.error ? undefined : res?.info;
    },

    async state(options = {}) {
      const res = await info.fire(options);
      return res.error ? undefined : res?.info?.state;
    },
  };

  /**
   * Errors.
   */
  const errors$ = rx.payload<t.WebRtcErrorEvent>($, 'sys.net.webrtc/error');
  const errors: t.WebRtcEvents['errors'] = {
    $: errors$,
    peer$: errors$.pipe(
      rx.filter((e) => e.kind === 'Peer'),
      rx.map((e) => e.error),
    ),
  };

  /**
   * Connect (Action).
   */
  const connect: t.WebRtcEvents['connect'] = {
    req$: rx.payload<t.WebRtcConnectReqEvent>($, 'sys.net.webrtc/connect:req'),
    start$: rx.payload<t.WebRtcConnectStartEvent>($, 'sys.net.webrtc/connect:start'),
    complete$: rx.payload<t.WebRtcConnectCompleteEvent>($, 'sys.net.webrtc/connect:complete'),
    async fire(remote, options = {}) {
      const { timeout = 10000 } = options;
      const tx = slug();
      const op = 'connect';
      const res$ = connect.complete$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.WebRtcConnectCompleteEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.net.webrtc/connect:req',
        payload: { tx, instance, remote },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      const state = (await info.get())?.state.current.network!;
      const peer = { local, remote };
      return { tx, instance, peer, state, error };
    },
  };

  /**
   * Peer Connections.
   */
  const changed$ = rx.payload<t.WebRtcConnectionsChangedEvent>($, 'sys.net.webrtc/conns:changed');
  const connections: t.WebRtcEvents['connections'] = {
    get changed() {
      const $ = changed$.pipe(rx.map((e) => e.change));
      return WebRtcUtil.connections.changed($);
    },
  };

  /**
   * Close.
   */
  const close: t.WebRtcEvents['close'] = {
    req$: rx.payload<t.WebRtcCloseReqEvent>($, 'sys.net.webrtc/close:req'),
    res$: rx.payload<t.WebRtcCloseResEvent>($, 'sys.net.webrtc/close:res'),
    async fire(remote, options = {}) {
      const { timeout = 10000 } = options;
      const tx = slug();
      const op = 'close';
      const res$ = close.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.WebRtcCloseResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.net.webrtc/close:req',
        payload: { tx, instance, remote },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      const state = (await info.get())?.state.current.network!;
      const peer = { local, remote };
      return { tx, instance, peer, state, error };
    },
  };

  /**
   * Prune
   */
  const prune: t.WebRtcEvents['prune'] = {
    req$: rx.payload<t.WebRtcPrunePeersReqEvent>($, 'sys.net.webrtc/prune:req'),
    res$: rx.payload<t.WebRtcPrunePeersResEvent>($, 'sys.net.webrtc/prune:res'),
    async fire(options = {}) {
      const { timeout = DEFAULT.timeout } = options;
      const tx = slug();
      const op = 'prune';
      const res$ = prune.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.WebRtcPrunePeersResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.net.webrtc/prune:req',
        payload: { tx, instance },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, removed: [], error };
    },
  };

  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    $,
    info,
    errors,
    connect,
    connections,
    close,
    prune,

    /**
     * Disposal.
     */
    dispose,
    dispose$,
    get disposed() {
      return _isDisposed;
    },
  };
}

/**
 * Helpers.
 */

const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
export const is = {
  base: matcher('sys.net.webrtc/'),
  instance: (e: t.Event, instance: Id) => is.base(e) && e.payload?.instance === instance,
};

const Wrangle = {
  id(args: Args) {
    const id = typeof args.peer === 'string' ? args.peer : args.peer.id;
    return id;
  },
};

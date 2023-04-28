import { WebRtcUtil, rx, slug, t } from './common';

type Id = string;

const DEFAULT = { timeout: 1000 };

/**
 * Creat a new events API wrapper.
 */
export function factory(
  bus: t.EventBus<any>,
  peer: t.PeerId,
  options: { dispose$?: t.Observable<any> } = {},
) {
  const { dispose$ } = options;
  return WebRtcEvents({ instance: { bus, id: peer }, dispose$ });
}

/**
 * Event API.
 */
export function WebRtcEvents(args: {
  instance: { bus: t.EventBus<any>; id: t.PeerId };
  filter?: (e: t.WebRtcEvent) => boolean;
  dispose$?: t.Observable<any>;
}): t.WebRtcEvents {
  let _isDisposed = false;
  const { dispose, dispose$ } = rx.disposable(args.dispose$);
  dispose$.subscribe(() => (_isDisposed = true));

  const bus = rx.busAsType<t.WebRtcEvent>(args.instance.bus);
  const instance = args.instance.id;
  const local = instance;
  const is = WebRtcEvents.is;

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
 * Event matching.
 */
const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
WebRtcEvents.is = {
  base: matcher('sys.net.webrtc/'),
  instance: (e: t.Event, instance: Id) =>
    WebRtcEvents.is.base(e) && e.payload?.instance === instance,
};

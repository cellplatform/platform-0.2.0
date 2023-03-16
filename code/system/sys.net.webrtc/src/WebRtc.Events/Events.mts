import { WebRtcUtil, rx, slug, t } from './common';

type Id = string;

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
      const { timeout = 3000 } = options;
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
   * Connect (Action)
   */
  const connect: t.WebRtcEvents['connect'] = {
    start$: rx.payload<t.WebRtcConnectStartEvent>($, 'sys.net.webrtc/connect:start'),
    complete$: rx.payload<t.WebRtcConnectCompleteEvent>($, 'sys.net.webrtc/connect:complete'),
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

  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    $,
    info,
    connect,
    connections,

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

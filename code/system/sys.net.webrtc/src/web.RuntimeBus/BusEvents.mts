import { filter, takeUntil } from 'rxjs/operators';
import { DEFAULT, rx, slug, t } from './common';

type Id = string;

/**
 * Event API for the "WebRuntime"
 */
export function BusEvents(args: {
  instance: t.WebRuntimeInstance;
  filter?: (e: t.WebRuntimeEvent) => boolean;
}): t.WebRuntimeEventsDisposable {
  const { dispose, dispose$ } = rx.disposable();
  const instance = args.instance.id ?? DEFAULT.instance;
  const bus = rx.busAsType<t.WebRuntimeEvent>(args.instance.bus);
  const is = BusEvents.is;

  const $ = bus.$.pipe(
    takeUntil(dispose$),
    filter((e) => is.instance(e, instance)),
    filter((e) => args.filter?.(e) ?? true),
  );

  /**
   * Base information about the module.
   */
  const info: t.WebRuntimeEvents['info'] = {
    req$: rx.payload<t.WebRuntimeInfoReqEvent>($, 'sys.runtime.web/info:req'),
    res$: rx.payload<t.WebRuntimeInfoResEvent>($, 'sys.runtime.web/info:res'),
    async get(options = {}) {
      const { timeout = 90000 } = options;
      const tx = slug();
      const op = 'info';
      const res$ = info.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.WebRuntimeInfoResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.runtime.web/info:req',
        payload: { tx, instance },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, exists: false, error };
    },
  };

  /**
   * Netbus request.
   */
  const netbus: t.WebRuntimeEvents['netbus'] = {
    req$: rx.payload<t.WebRuntimeNetbusReqEvent>($, 'sys.runtime.web/netbus:req'),
    res$: rx.payload<t.WebRuntimeNetbusResEvent>($, 'sys.runtime.web/netbus:res'),
    async get(options = {}) {
      const { timeout = 500 } = options;
      const tx = slug();
      const op = 'netbus';
      const res$ = netbus.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.WebRuntimeNetbusResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.runtime.web/netbus:req',
        payload: { tx, instance },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, exists: false, error };
    },
  };

  /**
   * API
   */
  const api: t.WebRuntimeEventsDisposable = {
    $,
    instance: { bus: rx.bus.instance(bus), id: instance },
    is,
    dispose,
    dispose$,
    info,
    netbus,
    clone() {
      const clone = { ...api };
      delete (clone as any).dispose;
      return clone;
    },
  };

  return api;
}

/**
 * Event matching.
 */
const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
BusEvents.is = {
  base: matcher('sys.runtime.web/'),
  instance: (e: t.Event, id: Id) => BusEvents.is.base(e) && e.payload?.instance === id,
};

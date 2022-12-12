import { rx, slug, t } from './common';

type Id = string;

/**
 * Event API.
 */
export function BusEvents(args: {
  instance: { bus: t.EventBus<any>; id: Id };
  filter?: (e: t.DevEvent) => boolean;
  dispose$?: t.Observable<any>;
}): t.DevEvents {
  const { dispose, dispose$ } = rx.disposable(args.dispose$);

  const bus = rx.busAsType<t.DevEvent>(args.instance.bus);
  const instance = args.instance.id;
  const is = BusEvents.is;

  const $ = bus.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => is.instance(e, instance)),
    rx.filter((e) => args.filter?.(e) ?? true),
  );

  /**
   * Base information about the module.
   */
  const info: t.DevEvents['info'] = {
    req$: rx.payload<t.DevInfoReqEvent>($, 'sys.dev/info:req'),
    res$: rx.payload<t.DevInfoResEvent>($, 'sys.dev/info:res'),
    changed$: rx.payload<t.DevInfoChangedEvent>($, 'sys.dev/info:changed'),
    async get(options = {}) {
      const { timeout = 3000 } = options;
      const tx = slug();
      const op = 'info';
      const res$ = info.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.DevInfoResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.dev/info:req',
        payload: { tx, instance },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, error };
    },
  };

  /**
   * Load.
   */
  const load: t.DevEvents['load'] = {
    req$: rx.payload<t.DevLoadReqEvent>($, 'sys.dev/load:req'),
    res$: rx.payload<t.DevLoadResEvent>($, 'sys.dev/load:res'),
    async fire(bundle, options = {}) {
      const { timeout = 3000 } = options;
      const tx = slug();
      const op = 'load';
      const res$ = load.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.DevInfoResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.dev/load:req',
        payload: { tx, instance, bundle },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, error };
    },
  };

  const unload: t.DevEvents['unload'] = {
    fire(options) {
      return load.fire(undefined, options);
    },
  };

  /**
   * Run.
   */
  const run: t.DevEvents['run'] = {
    req$: rx.payload<t.DevRunReqEvent>($, 'sys.dev/run:req'),
    res$: rx.payload<t.DevRunResEvent>($, 'sys.dev/run:res'),
    async fire(options = {}) {
      const { timeout = 3000 } = options;
      const tx = slug();
      const op = 'run';
      const res$ = run.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.DevInfoResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.dev/run:req',
        payload: { tx, instance },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, error };
    },
  };

  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    $,
    dispose,
    dispose$,
    is,
    info,
    load,
    unload,
    run,
  };
}

/**
 * Event matching.
 */
const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
BusEvents.is = {
  base: matcher('sys.dev/'),
  instance: (e: t.Event, instance: Id) => BusEvents.is.base(e) && e.payload?.instance === instance,
};

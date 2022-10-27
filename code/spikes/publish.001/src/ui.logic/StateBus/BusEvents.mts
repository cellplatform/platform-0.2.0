import { filter, takeUntil } from 'rxjs/operators';

import { rx, slug, t, DEFAULTS } from './common.mjs';

type Id = string;

/**
 * Event API.
 */
export function BusEvents(args: {
  instance: { bus: t.EventBus<any>; id?: Id };
  filter?: (e: t.StateEvent) => boolean;
  dispose$?: t.Observable<any>;
}): t.StateEvents {
  const { dispose, dispose$ } = rx.disposable(args.dispose$);

  const bus = rx.busAsType<t.StateEvent>(args.instance.bus);
  const instance = args.instance.id || DEFAULTS.instance;
  const is = BusEvents.is;

  const $ = bus.$.pipe(
    takeUntil(dispose$),
    filter((e) => is.instance(e, instance)),
    filter((e) => args.filter?.(e) ?? true),
  );

  /**
   * Base information about the module.
   */
  const info: t.StateEvents['info'] = {
    req$: rx.payload<t.StateReqEvent>($, 'app.state/info:req'),
    res$: rx.payload<t.StateResEvent>($, 'app.state/info:res'),
    async get(options = {}) {
      const { timeout = 3000 } = options;
      const tx = slug();

      const op = 'info';
      const res$ = info.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.StateResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'app.state/info:req',
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
  };
}

/**
 * Event matching.
 */
const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
BusEvents.is = {
  base: matcher('app.state/'),
  instance: (e: t.Event, instance: Id) => BusEvents.is.base(e) && e.payload?.instance === instance,
};

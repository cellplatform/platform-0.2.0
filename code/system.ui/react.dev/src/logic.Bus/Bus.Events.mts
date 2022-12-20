import { Observable, timeout } from 'rxjs';
import { filter } from 'rxjs/operators';

import { asArray, rx, slug, t } from './common';
import { DEFAULT } from './DEFAULT.mjs';

type Id = string;

/**
 * Event API.
 */
export function BusEvents(args: {
  instance: { bus: t.EventBus<any>; id: Id };
  filter?: (e: t.DevEvent) => boolean;
  dispose$?: t.Observable<any>;
}): t.DevEvents {
  let _disposed = false;
  const { dispose, dispose$ } = rx.disposable(args.dispose$);
  dispose$.subscribe(() => (_disposed = true));

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
    async fire(options = {}) {
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

    async get(options) {
      const res = await info.fire(options);
      if (res.error) throw new Error(res.error);
      if (!res.info) throw new Error(`Status: info not available`);
      return res.info;
    },

    async ctx(options) {
      const res = await info.fire(options);
      if (res.error) throw new Error(res.error);
      if (!res.ctx) throw new Error(`Status: ctx not available`);
      return res.ctx;
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
      const first = rx.asPromise.first<t.DevLoadResEvent>(res$, { op, timeout });

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
      const only = options.only ? asArray(options.only) : undefined;
      const tx = slug();
      const op = 'run';
      const res$ = run.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.DevRunResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.dev/run:req',
        payload: { tx, instance, only },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, error };
    },
  };

  /**
   * Reset
   */
  const reset: t.DevEvents['reset'] = {
    req$: rx.payload<t.DevResetReqEvent>($, 'sys.dev/reset:req'),
    res$: rx.payload<t.DevResetResEvent>($, 'sys.dev/reset:res'),
    async fire(options = {}) {
      const { timeout = 3000 } = options;
      const tx = slug();
      const op = 'reset';
      const res$ = reset.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.DevRunResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.dev/reset:req',
        payload: { tx, instance },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, error };
    },
  };

  /**
   * State
   */
  const state: t.DevEvents['state'] = {
    changed$: info.changed$.pipe(
      filter((e) => {
        const match: t.DevInfoChangeMessage[] = ['state:write', 'context:init'];
        return match.includes(e.message);
      }),
    ),
    change: {
      req$: rx.payload<t.DevStateChangeReqEvent>($, 'sys.dev/state/change:req'),
      res$: rx.payload<t.DevStateChangeResEvent>($, 'sys.dev/state/change:res'),
      async fire(args) {
        const { initial, mutate, timeout = 3000 } = args;
        const tx = slug();
        const op = 'state.change';
        const res$ = state.change.res$.pipe(rx.filter((e) => e.tx === tx));
        const first = rx.asPromise.first<t.DevStateChangeResEvent>(res$, { op, timeout });

        bus.fire({
          type: 'sys.dev/state/change:req',
          payload: { tx, instance, mutate, initial },
        });

        const res = await first;
        if (res.payload) return res.payload;

        const error = res.error?.message ?? 'Failed';
        return { tx, instance, error };
      },
    },
  };

  /**
   * Props (Display/Harness)
   * Generated by Specs using the {ctx} object.
   */
  const props: t.DevEvents['props'] = {
    changed$: info.changed$.pipe(
      filter((e) => {
        // const match: t.DevInfoChangeMessage[] = ['state:write', 'context:init'];
        // return match.includes(e.message);
        /**
         * TODO 🐷
         */

        return true;
      }),
    ),
    change: {
      req$: rx.payload<t.DevPropsChangeReqEvent>($, 'sys.dev/props/change:req'),
      res$: rx.payload<t.DevPropsChangeResEvent>($, 'sys.dev/props/change:res'),
      async fire(args) {
        const { mutate, timeout = 3000 } = args;
        const tx = slug();
        const op = 'props.change';
        const res$ = props.change.res$.pipe(rx.filter((e) => e.tx === tx));
        const first = rx.asPromise.first<t.DevPropsChangeResEvent>(res$, { op, timeout });

        bus.fire({
          type: 'sys.dev/props/change:req',
          payload: { tx, instance, mutate },
        });

        const res = await first;
        if (res.payload) return res.payload;

        const error = res.error?.message ?? 'Failed';
        return { tx, instance, error };
      },
    },
  };

  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    $,
    dispose,
    dispose$,
    get disposed() {
      return _disposed;
    },
    is,
    info,
    load,
    unload,
    run,
    reset,
    state,
    props,
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

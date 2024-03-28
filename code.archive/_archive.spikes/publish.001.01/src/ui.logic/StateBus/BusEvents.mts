import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { DEFAULTS, rx, slug, t } from './common.mjs';

type Id = string;

/**
 * Event API.
 */
export function BusEvents(args: {
  instance: t.Instance;
  filter?: (e: t.StateEvent) => boolean;
  dispose$?: t.Observable<any>;
}): t.StateEvents {
  const { dispose, dispose$ } = rx.disposable(args.dispose$);

  const bus = rx.busAsType<t.StateEvent>(args.instance.bus);
  const instance = args.instance.id || DEFAULTS.instance;
  const is = BusEvents.is;

  const $ = bus.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => is.instance(e, instance)),
    rx.filter((e) => args.filter?.(e) ?? true),
  );

  /**
   * Initialization upon load.
   */
  const init = async () => {
    await fetch.fire({ topic: ['RootIndex', 'Log'] });

    const current = (await info.get()).info?.current;

    /**
     * TODO 🐷 TMP HACK!!!
     * Do not hard code the initial path.  Derive it from the root [index.md]
     */
    if (!current?.selection.index?.path) {
      const FOREWORD = './0/root.md';
      await select.fire(FOREWORD);
    }
  };

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
      const res$ = info.res$.pipe(rx.filter((e) => e.tx === tx));
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

  /**
   * Fetch
   */
  const fetch: t.StateEvents['fetch'] = {
    req$: rx.payload<t.StateFetchReqEvent>($, 'app.state/fetch:req'),
    res$: rx.payload<t.StateFetchResEvent>($, 'app.state/fetch:res'),
    async fire(options = {}) {
      const { timeout = 3000, topic } = options;
      const tx = slug();
      const op = 'fetch';
      const res$ = fetch.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.StateFetchResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'app.state/fetch:req',
        payload: { tx, instance, topic },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, current: DEFAULTS.state, error };
    },
  };

  /**
   * Change
   */
  const change: t.StateEvents['change'] = {
    req$: rx.payload<t.StateChangeReqEvent>($, 'app.state/change:req'),
    res$: rx.payload<t.StateChangeResEvent>($, 'app.state/change:res'),
    async fire(message, handler, options = {}) {
      const { timeout = 3000 } = options;
      const tx = slug();
      const op = 'change';
      const res$ = change.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.StateChangeResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'app.state/change:req',
        payload: { tx, instance, message, handler },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, current: DEFAULTS.state, message: '', error };
    },
  };

  /**
   * Changed
   */
  const changed: t.StateEvents['changed'] = {
    $: rx.payload<t.StateChangedEvent>($, 'app.state/changed'),
    async fire(...messages) {
      const res = await info.get();
      const current = res.info?.current ?? DEFAULTS.state;
      bus.fire({
        type: 'app.state/changed',
        payload: { instance, current, messages },
      });
    },
  };

  /**
   * Select
   */
  const select: t.StateEvents['select'] = {
    $: rx.payload<t.StateSelectEvent>($, 'app.state/select'),
    async fire(selected) {
      bus.fire({
        type: 'app.state/select',
        payload: { instance, selected },
      });
    },
  };

  /**
   * Overlay
   */
  const overlay: t.StateEvents['overlay'] = {
    req$: rx.payload<t.StateOverlayReqEvent>($, 'app.state/overlay:req'),
    res$: rx.payload<t.StateOverlayResEvent>($, 'app.state/overlay:res'),
    close$: rx.payload<t.StateOverlayCloseEvent>($, 'app.state/overlay:close'),
    content$: changed.$.pipe(
      filter((e) => Boolean(e.current.overlay)),
      map((e) => e.current.overlay!),
      distinctUntilChanged((prev, next) => {
        if (prev.tx !== next.tx) return false;
        if (Boolean(prev.content) !== Boolean(next.content)) return false;
        if (prev.content?.md.markdown !== next.content?.md.markdown) return false;
        return true;
      }),
    ),
    async def(def, path, options = {}) {
      const { context } = options;
      const tx = slug();
      const op = 'overaly';
      const res$ = overlay.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.StateOverlayResEvent>(res$, { op });

      bus.fire({
        type: 'app.state/overlay:req',
        payload: { tx, instance, def, path, context },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const errors = [res.error?.message ?? 'Failed'];
      return { tx, instance, errors };
    },

    async close(options = {}) {
      const { errors = [] } = options;
      bus.fire({
        type: 'app.state/overlay:close',
        payload: { instance, errors },
      });
    },
  };

  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    $,
    dispose,
    dispose$,
    is,
    init,
    info,
    fetch,
    change,
    changed,
    select,
    overlay,
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

import { DEFAULT, Patch, rx, slug, t } from './common';

type J = Record<string, unknown>;
type Id = string;
type Milliseconds = number;
type KeyPath = string;

const { toObject } = Patch;

/**
 * Event API
 *
 * Standard:
 *    RFC-6902 JSON patch standard
 *    https://tools.ietf.org/html/rfc6902
 *
 */
export function JsonBusEvents(args: {
  instance: t.JsonBusInstance;
  filter?: t.JsonEventFilter;
  dispose$?: t.Observable<any>;
}): t.JsonEvents {
  const { dispose, dispose$ } = rx.disposable(args.dispose$);

  const bus = rx.busAsType<t.JsonEvent>(args.instance.bus);
  const instance = args.instance.id;
  const is = JsonBusEvents.is;

  const $ = bus.$.pipe(
    rx.takeUntil(dispose$),
    rx.filter((e) => is.instance(e, instance)),
    rx.filter((e) => args.filter?.(e) ?? true),
  );

  const changed$ = rx
    .payload<t.JsonStateChangedEvent>($, 'sys.json/state:changed')
    .pipe(rx.map((e) => e.change));

  /**
   * Base information about the module.
   */
  const info: t.JsonEvents['info'] = {
    req$: rx.payload<t.JsonInfoReqEvent>($, 'sys.json/info:req'),
    res$: rx.payload<t.JsonInfoResEvent>($, 'sys.json/info:res'),
    async get(options = {}) {
      const { timeout = DEFAULT.TIMEOUT } = options;
      const tx = slug();

      const op = 'info';
      const res$ = info.res$.pipe(rx.filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.JsonInfoResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.json/info:req',
        payload: { tx, instance },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, error };
    },
  };

  /**
   * GET
   */
  const get: t.JsonEventsState['get'] = {
    req$: rx.payload<t.JsonStateGetReqEvent>($, 'sys.json/state.get:req'),
    res$: rx.payload<t.JsonStateGetResEvent>($, 'sys.json/state.get:res'),
    async fire<T extends J = J>(
      options: { tx?: Id; timeout?: Milliseconds; key?: KeyPath; initial?: T | (() => T) } = {},
    ) {
      const { timeout = DEFAULT.TIMEOUT, key = DEFAULT.KEY, tx = slug() } = options;
      type R = t.JsonStateGetRes<T>;
      const response = (value?: T, error?: string): R => ({ tx, instance, key, value, error });

      const fire = async (): Promise<R> => {
        const op = 'state.get';
        const res$ = get.res$.pipe(rx.filter((e) => e.tx === tx && e.key === key));
        const first = rx.asPromise.first<t.JsonStateGetResEvent>(res$, { op, timeout });
        bus.fire({
          type: 'sys.json/state.get:req',
          payload: { tx, instance, key },
        });

        const res = await first;
        if (res.payload) return res.payload as R;

        const error = res.error?.message ?? 'Failed';
        return response(undefined, error);
      };

      const res = await fire();

      // Value not found, look for an initial value.
      if (!res.value && options.initial !== undefined) {
        const initial = Util.toInitial(options.initial);
        if (initial) {
          const write = await put.fire(initial, { tx, key, timeout });
          if (write.error) return response(undefined, write.error);
          return response(initial);
        }
      }

      return res;
    },
  };

  /**
   * PUT
   */
  const put: t.JsonEventsState['put'] = {
    req$: rx.payload<t.JsonStatePutReqEvent>($, 'sys.json/state.put:req'),
    res$: rx.payload<t.JsonStatePutResEvent>($, 'sys.json/state.put:res'),
    async fire<T extends J = J>(
      value: T,
      options: { tx?: Id; timeout?: Milliseconds; key?: KeyPath } = {},
    ) {
      const { timeout = DEFAULT.TIMEOUT, key = DEFAULT.KEY, tx = slug() } = options;

      const op = 'state.put';
      const res$ = put.res$.pipe(rx.filter((e) => e.tx === tx && e.key === key));
      const first = rx.asPromise.first<t.JsonStatePutResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.json/state.put:req',
        payload: { tx, instance, key, value },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, key, error };
    },
  };

  /**
   * PATCH
   */
  const patch: t.JsonEventsState['patch'] = {
    req$: rx.payload<t.JsonStatePatchReqEvent>($, 'sys.json/state.patch:req'),
    res$: rx.payload<t.JsonStatePatchResEvent>($, 'sys.json/state.patch:res'),
    async fire<T extends J = J>(
      fn: t.JsonMutation<T>,
      options: { tx?: Id; timeout?: Milliseconds; key?: KeyPath; initial?: T | (() => T) } = {},
    ): Promise<t.JsonStatePatchRes> {
      const { timeout = DEFAULT.TIMEOUT, key = DEFAULT.KEY, tx = slug(), initial } = options;

      const response = (error?: string): t.JsonStatePatchRes => {
        return { tx, instance, key, error };
      };

      const current = await get.fire({ tx, timeout, key, initial });
      if (current.error) return response(current.error);

      const value = current.value;
      if (!value) {
        const error = `Failed to patch, could not retrieve current state (key="${key}"). Ensure the [sys.json] controller has been started (instance="${instance}").`;
        return response(error);
      }

      const op = 'state.patch';
      const res$ = patch.res$.pipe(rx.filter((e) => e.tx === tx && e.key === key));
      const first = rx.asPromise.first<t.JsonStatePatchResEvent>(res$, { op, timeout });

      const change = await Patch.changeAsync<T>(value as any, fn);
      bus.fire({
        type: 'sys.json/state.patch:req',
        payload: { tx, instance, key, op: change.op, patches: change.patches },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance, key, error };
    },
  };

  /**
   * State.
   */
  const state: t.JsonEventsState = { get, put, patch };

  /**
   * A lens into a sub-set of the object.
   */
  function toLens<R extends J, L extends J>(args: {
    root: t.JsonState<R>;
    target: (root: R) => L;
    timeout?: Milliseconds;
  }): t.JsonLens<L> {
    type O = { timeout?: Milliseconds };
    const asTimeout = (options: O) => options.timeout ?? args.timeout ?? DEFAULT.TIMEOUT;
    const nil = (value: any) => typeof value !== 'object' || value === null;

    const lens: t.JsonLens<L> = {
      $: args.root.$.pipe(rx.map((e) => args.target(e.value))),

      get current() {
        return args.target(args.root.current);
      },

      async patch(fn, options = {}) {
        const timeout = asTimeout(options);

        const handler: t.JsonMutation<R> = (root) => {
          const target = args.target(root);
          if (nil(target)) throw new Error(`Lens target child could not be derived from the root`);

          const ctx: t.JsonMutationCtx = { toObject };
          fn(target, ctx);
        };

        const { error } = await args.root.patch(handler, { ...options, timeout });
        if (error) throw new Error(error);
      },
    };

    return lens;
  }

  /**
   * JSON (key-pathed convenience method).
   */
  const json = <T extends J = J>(
    initial: T | (() => T),
    args: t.JsonStateOptions = {},
  ): t.JsonState<T> => {
    type O = { timeout?: Milliseconds };
    const asTimeout = (options: O) => options.timeout ?? args.timeout ?? DEFAULT.TIMEOUT;
    const { key = DEFAULT.KEY } = args;

    const $ = changed$.pipe(
      rx.filter((e) => e.key === key),
      rx.map((e) => e as t.JsonStateChange<T>),
    );

    let _current: T | undefined;
    $.subscribe((e) => (_current = e.value));

    const root: t.JsonState<T> = {
      $,
      get current() {
        if (_current === undefined) _current = Util.toInitial(initial);
        return _current as T;
      },
      get(options = {}) {
        const timeout = asTimeout(options);
        return get.fire<T>({ key, timeout, initial });
      },
      put(value, options = {}) {
        const timeout = asTimeout(options);
        return put.fire<T>(value, { key, timeout });
      },
      patch(fn, options = {}) {
        const timeout = asTimeout(options);
        return patch.fire<T>(fn, { key, timeout, initial });
      },
      lens<L extends J = J>(target: (root: T) => L) {
        const timeout = asTimeout({});
        return toLens<T, L>({ root, target, timeout });
      },
    };

    return root;
  };

  /**
   * API
   */
  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    $,
    changed$,
    dispose,
    dispose$,
    is,
    info,
    state,
    json,
  };
}

/**
 * Event matching.
 */
const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
const is = {
  base: matcher('sys.json/'),
  instance: (e: t.Event, instance: Id) => is.base(e) && e.payload?.instance === instance,
};

/**
 * Decorate
 */
JsonBusEvents.is = is;

/**
 * Helpers
 */
const Util = {
  toInitial<T extends J = J>(initial?: T | (() => T)) {
    return typeof initial === 'function' ? initial() : initial;
  },
};

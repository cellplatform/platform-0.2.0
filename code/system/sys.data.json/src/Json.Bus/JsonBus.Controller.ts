import { DEFAULT, Patch, Pkg, rx, t } from './common';
import { JsonBusEvents } from './JsonBus.Events';

type J = Record<string, unknown>;
type Cache = { [key: string]: any };

/**
 * Controller that manages a cache of immutable JSON state objects.
 *
 * Standard:
 *    RFC-6902 JSON patch standard
 *    https://tools.ietf.org/html/rfc6902
 *
 */
export function JsonBusController(args: {
  instance: t.JsonBusInstance;
  filter?: t.JsonEventFilter;
  dispose$?: t.Observable<any>;
}) {
  const bus = rx.busAsType<t.JsonEvent>(args.instance.bus);
  const instance = args.instance.id;

  const events = JsonBusEvents({
    instance: args.instance,
    dispose$: args.dispose$,
    filter: args.filter,
  });
  const { dispose, dispose$ } = events;

  const _changed$ = new rx.Subject<t.JsonStateChange>();
  const changed$ = _changed$.pipe(rx.takeUntil(dispose$));
  changed$.subscribe((change) =>
    bus.fire({
      type: 'sys.json/state:changed',
      payload: { instance, change },
    }),
  );

  /**
   * State
   */
  const cache: Cache = {};
  const change = (op: t.PatchOperationKind, key: string, fn: (prev: J) => J) => {
    cache[key] = fn(cache[key]);
    _changed$.next({ key, op, value: cache[key] });
    if (cache[key] === undefined) delete cache[key];
  };

  /**
   * Info (Module)
   */
  events.info.req$.subscribe((e) => {
    const { tx } = e;
    const { name = '', version = '' } = Pkg;
    const keys = Object.keys(cache);
    const info: t.JsonInfo = { module: { name, version }, keys };
    bus.fire({
      type: 'sys.json/info:res',
      payload: { tx, instance, info },
    });
  });

  /**
   * State.get (READ)
   */
  events.state.get.req$.subscribe((e) => {
    const { tx, key = DEFAULT.KEY } = e;
    const state = cache[key];
    bus.fire({
      type: 'sys.json/state.get:res',
      payload: { instance, tx, key, value: state },
    });
  });

  /**
   * State.put (UPDATE/OVERWRITE)
   */
  events.state.put.req$.subscribe((e) => {
    const { tx, key = DEFAULT.KEY } = e;
    change('replace', key, () => e.value);
    bus.fire({
      type: 'sys.json/state.put:res',
      payload: { instance, tx, key },
    });
  });

  /**
   * State.patch (UPDATE)
   */
  events.state.patch.req$.subscribe((e) => {
    const { tx, key, op, patches } = e;
    const state = cache[key];
    if (patches.next.length > 0) change(op, key, () => Patch.apply(state, patches));
    bus.fire({
      type: 'sys.json/state.patch:res',
      payload: { instance, tx, key },
    });
  });

  /**
   * API
   */
  return {
    instance: { bus: rx.bus.instance(bus), id: instance },
    dispose,
    dispose$,
    changed$,
  };
}

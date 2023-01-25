import { animationFrameScheduler, Subject, Observable } from 'rxjs';
import { filter, observeOn, takeUntil, map } from 'rxjs/operators';

import { rx, t } from '../common';

type Id = string;
type O = Record<string, unknown>;

/**
 * Event API.
 */
export function UIEvents<Ctx extends O = O>(args: {
  bus: t.EventBus<any>;
  instance: Id;
  dispose$?: Observable<any>;
  filter?: t.UIEventFilter<Ctx>;
}): t.UIEvents<Ctx> {
  const { instance } = args;
  const bus = rx.busAsType<t.UIEvent>(args.bus);

  const dispose$ = new Subject<void>();
  const dispose = () => dispose$.next();
  args.dispose$?.subscribe(dispose);

  type UIEvent$ = t.Observable<t.UIEvent<Ctx>>;
  const $: UIEvent$ = bus.$.pipe(
    takeUntil(dispose$),
    filter((e) => e.type.startsWith('sys.ui.event/')),
    map((e) => e as t.UIEvent<Ctx>),
    filter((e) => e.payload.instance === instance),
    filter((e) => (args.filter ? args.filter(e) : true)),
    observeOn(animationFrameScheduler),
  );

  const Mouse = ($: UIEvent$, fn: (e: t.UIMouse<Ctx>) => boolean): t.UIEventsMouse<Ctx> => {
    $ = $.pipe(
      filter((e) => e.type === 'sys.ui.event/Mouse'),
      map((e) => e as t.UIMouseEvent<Ctx>),
      filter((e) => fn(e.payload)),
    );
    const payload$ = $.pipe(map((e) => e.payload as t.UIMouse<Ctx>));
    return {
      $: payload$,
      event: (name) => payload$.pipe(filter((e) => e.name === name)),
      filter: (fn) => Mouse($, fn),
    };
  };

  const Touch = ($: UIEvent$, fn: (e: t.UITouch<Ctx>) => boolean): t.UIEventsTouch<Ctx> => {
    $ = $.pipe(
      filter((e) => e.type === 'sys.ui.event/Touch'),
      map((e) => e as t.UITouchEvent<Ctx>),
      filter((e) => fn(e.payload)),
    );
    const payload$ = $.pipe(map((e) => e.payload as t.UITouch<Ctx>));
    return {
      $: payload$,
      filter: (fn) => Touch($, fn),
      event: (name) => payload$.pipe(filter((e) => e.name === name)),
    };
  };

  const Focus = ($: UIEvent$, fn: (e: t.UIFocus<Ctx>) => boolean): t.UIEventsFocus<Ctx> => {
    $ = $.pipe(
      filter((e) => e.type === 'sys.ui.event/Focus'),
      map((e) => e as t.UIFocusEvent<Ctx>),
      filter((e) => fn(e.payload)),
    );
    const payload$ = $.pipe(map((e) => e.payload as t.UIFocus<Ctx>));
    return {
      $: payload$,
      filter: (fn) => Focus($, fn),
      event: (name) => payload$.pipe(filter((e) => e.name === name)),
    };
  };

  // NB: Lazy instantiation.
  const _cache: { [key: string]: any } = {};
  const cache = (key: string, factory: () => any) => _cache[key] || (_cache[key] = factory());

  /**
   * API
   */
  return {
    $,
    bus: rx.bus.instance(bus),
    instance,
    dispose,
    dispose$,
    get mouse() {
      return cache('mouse', () => Mouse($, () => true));
    },
    get touch() {
      return cache('touch', () => Touch($, () => true));
    },
    get focus() {
      return cache('focus', () => Focus($, () => true));
    },
  };
}

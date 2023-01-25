import { filter, takeUntil } from 'rxjs/operators';

import { rx, t, slug } from '../common';

type E = t.TextInputEvents;

export type TextInputEventsArgs = {
  instance: t.TextInputInstance;
  dispose$?: t.Observable<any>;
};

/**
 * Event API
 */
export function TextInputEvents(args: TextInputEventsArgs) {
  const { dispose, dispose$ } = rx.disposable(args.dispose$);

  const instance = args.instance.id;
  const bus = rx.busAsType<t.TextInputEvent>(args.instance.bus);

  const $ = bus.$.pipe(
    takeUntil(dispose$),
    filter((e) => e.type.startsWith('sys.ui.TextInput/')),
    filter((e) => e.payload.instance === instance),
  );

  const text: E['text'] = {
    changing$: rx.payload<t.TextInputChangingEvent>($, 'sys.ui.TextInput/Changing'),
    changed$: rx.payload<t.TextInputChangedEvent>($, 'sys.ui.TextInput/Changed'),
  };

  const focus: E['focus'] = {
    $: rx.payload<t.TextInputFocusEvent>($, 'sys.ui.TextInput/Focus'),
    fire(focus = true) {
      bus.fire({
        type: 'sys.ui.TextInput/Focus',
        payload: { instance, focus },
      });
    },
  };

  type D = t.TextInputLabelDoubleClickedEvent;
  const mouse: E['mouse'] = {
    labelDoubleClicked$: rx.payload<D>($, 'sys.ui.TextInput/Label/DoubleClicked'),
  };

  const status: E['status'] = {
    req$: rx.payload<t.TextInputStatusReqEvent>($, 'sys.ui.TextInput/Status:req'),
    res$: rx.payload<t.TextInputStatusResEvent>($, 'sys.ui.TextInput/Status:res'),
    async get(options = {}) {
      const { timeout = 500 } = options;
      const tx = slug();

      const op = 'status';
      const res$ = status.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.TextInputStatusResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.ui.TextInput/Status:req',
        payload: { tx, instance },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, instance: instance, error };
    },
  };

  const select: E['select'] = {
    $: rx.payload<t.TextInputSelectEvent>($, 'sys.ui.TextInput/Select'),
    fire() {
      bus.fire({
        type: 'sys.ui.TextInput/Select',
        payload: { instance },
      });
    },
  };

  const cursor: E['cursor'] = {
    $: rx.payload<t.TextInputCursorEvent>($, 'sys.ui.TextInput/Cursor'),
    fire(action) {
      bus.fire({
        type: 'sys.ui.TextInput/Cursor',
        payload: { instance, action },
      });
    },
    start: () => cursor.fire('Cursor:Start'),
    end: () => cursor.fire('Cursor:End'),
  };

  /**
   * API
   */
  const api: t.TextInputEventsDisposable = {
    instance: { bus: rx.bus.instance(bus), id: instance },
    $,
    dispose,
    dispose$,
    text,
    focus,
    mouse,
    status,
    select,
    cursor,
    clone() {
      return { ...api, dispose: undefined };
    },
    toString() {
      return `${api.instance.bus}/instance:${api.instance.id}`;
    },
  };
  return api;
}

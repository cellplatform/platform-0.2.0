import { map, filter, takeUntil } from 'rxjs/operators';

import { DEFAULT, rx, slug, t } from './common.mjs';
import { CrdtDocEvents } from './BusEvents.Doc.mjs';

type O = Record<string, unknown>;
type DocumentId = string;
type InstanceId = string;
type Milliseconds = number;

/**
 * Event API for the "WebRuntime"
 */
export function BusEvents(args: {
  bus: t.EventBus<any>;
  id?: InstanceId;
  filter?: (e: t.CrdtEvent) => boolean;
}): t.CrdtEvents {
  const { dispose, dispose$ } = rx.disposable();
  const id = args.id ?? DEFAULT.id;
  const bus = rx.busAsType<t.CrdtEvent>(args.bus);
  const is = BusEvents.is;

  const $ = bus.$.pipe(
    takeUntil(dispose$),
    filter((e) => is.instance(e, id)),
    filter((e) => args.filter?.(e) ?? true),
  );

  /**
   * Base information about the module.
   */
  const info: t.CrdtEvents['info'] = {
    req$: rx.payload<t.CrdtInfoReqEvent>($, 'sys.crdt/info:req'),
    res$: rx.payload<t.CrdtInfoResEvent>($, 'sys.crdt/info:res'),
    async get(options = {}) {
      const { timeout = 3000 } = options;
      const tx = slug();
      const op = 'info';
      const res$ = info.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.CrdtInfoResEvent>(res$, { op, timeout });

      bus.fire({
        type: 'sys.crdt/info:req',
        payload: { tx, id },
      });

      const res = await first;
      if (res.payload) return res.payload;

      const error = res.error?.message ?? 'Failed';
      return { tx, id, error };
    },
  };

  /**
   * Ref: Document State
   */
  const state: t.CrdtEvents['ref'] = {
    req$: rx.payload<t.CrdtRefReqEvent>($, 'sys.crdt/ref:req'),
    res$: rx.payload<t.CrdtRefResEvent>($, 'sys.crdt/ref:res'),
    changed$: rx.payload<t.CrdtRefChangedEvent>($, 'sys.crdt/ref/changed'),

    created$: rx.payload<t.CrdtRefResEvent>($, 'sys.crdt/ref:res').pipe(
      filter((e) => e.created),
      map(({ id, doc }) => ({ id, doc } as t.CrdtRefCreated)),
    ),

    async fire<T extends O>(args: {
      id: DocumentId;
      load?: t.CrdtStorageCtx;
      change?: t.CrdtChangeHandler<T> | T;
      save?: t.CrdtStorageSaveCtx;
      timeout?: Milliseconds;
    }) {
      const { timeout = 3000, load, save } = args;
      const tx = slug();
      const op = 'ref.get';
      const res$ = state.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.CrdtRefResEvent>(res$, { op, timeout });

      const doc = { id: args.id };
      bus.fire({
        type: 'sys.crdt/ref:req',
        payload: { tx, id, doc, load, save, change: args.change as any },
      });

      const res = await first;
      if (res.payload) return res.payload as t.CrdtRefRes<T>;

      const error = res.error?.message ?? 'Failed';
      return { tx, id, created: false, doc: {}, error } as t.CrdtRefRes<T>;
    },

    exists: {
      req$: rx.payload<t.CrdtRefExistsReqEvent>($, 'sys.crdt/ref/exists:req'),
      res$: rx.payload<t.CrdtRefExistsResEvent>($, 'sys.crdt/ref/exists:res'),
      async fire(doc, options = {}) {
        const { timeout = 3000 } = options;
        const tx = slug();
        const op = 'ref.exists';
        const res$ = state.exists.res$.pipe(filter((e) => e.tx === tx));
        const first = rx.asPromise.first<t.CrdtRefExistsResEvent>(res$, { op, timeout });

        bus.fire({
          type: 'sys.crdt/ref/exists:req',
          payload: { tx, id, doc: { id: doc } },
        });

        const res = await first;
        if (res.payload) return res.payload;

        const error = res.error?.message ?? 'Failed';
        return { tx, id, exists: false, doc: { id: doc }, error };
      },
    },

    remove: {
      remove$: rx.payload<t.CrdtRefRemoveEvent>($, 'sys.crdt/ref/remove'),
      removed$: rx.payload<t.CrdtRefRemovedEvent>($, 'sys.crdt/ref/removed'),
      async fire(doc) {
        bus.fire({
          type: 'sys.crdt/ref/remove',
          payload: { id, doc: { id: doc } },
        });
      },
    },
  };

  const events: t.CrdtEvents = {
    $,
    instance: { bus: rx.bus.instance(bus), id },
    is,
    dispose,
    dispose$,
    info,
    ref: state,
    doc<T extends O>(args: t.CrdtDocEventsArgs<T>) {
      return CrdtDocEvents<T>({ ...args, events });
    },
  };
  return events;
}

/**
 * Event matching.
 */
const matcher = (startsWith: string) => (input: any) => rx.isEvent(input, { startsWith });
BusEvents.is = {
  base: matcher('sys.crdt/'),
  instance: (e: t.Event, id: InstanceId) => BusEvents.is.base(e) && e.payload?.id === id,
};

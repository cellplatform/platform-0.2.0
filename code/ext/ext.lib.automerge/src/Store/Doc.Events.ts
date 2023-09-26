import { rx, type t } from './common';

export const DocEvents = {
  init<T>(handle: t.DocHandle<T>, options: { dispose$?: t.Observable<any> } = {}) {
    const uri = handle.url;
    const life = rx.lifecycle(options.dispose$);
    const { dispose, dispose$ } = life;

    const fire$ = new rx.Subject<t.DocEvent<T>>();
    const fire = (e: t.DocEvent<T>) => fire$.next(e);
    const $ = fire$.pipe(rx.takeUntil(dispose$));

    handle.on('change', (e) => {
      const { doc, patches, patchInfo } = e;
      fire({
        type: 'crdt:DocChanged',
        payload: { uri, doc, patches, patchInfo },
      });
    });

    /**
     * API
     */
    const api: t.DocEvents<T> = {
      $,
      changed$: rx.payload<t.DocChangedEvent<T>>($, 'crdt:DocChanged'),

      /**
       * Lifecycle
       */
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    };
    return api;
  },
} as const;

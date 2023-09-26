import { rx, type t } from './common';

export const DocEvents = {
  init<T>(handle: t.DocHandle<T>, options: { dispose$?: t.Observable<any> } = {}) {
    const life = rx.lifecycle(options.dispose$);
    const { dispose, dispose$ } = life;

    const subject$ = new rx.Subject<t.DocEvent>();
    const $ = subject$.asObservable();

    /**
     * API
     */
    const api: t.DocEvents<T> = {
      dispose,
      dispose$,
      get disposed() {
        return life.disposed;
      },
    };
    return api;
  },
} as const;

import { eventsFactory } from './Doc.Events';
import { slug, toObject, type t } from './common';

export const Handle = {
  /**
   * Wrap a raw automerge document-handle as a [DocRefHandle].
   */
  wrap<T>(
    handle: t.DocHandle<T>,
    options: { dispose$?: t.UntilObservable } = {},
  ): t.DocRefHandle<T> {
    const api: t.DocRefHandle<T> = {
      instance: slug(),
      uri: handle.url,
      handle,
      get current() {
        return handle.docSync();
      },
      change(fn) {
        handle.change((d: any) => fn(d));
      },
      events(dispose$) {
        return eventsFactory<T>(api, { dispose$: [options.dispose$, dispose$] });
      },
      toObject() {
        return toObject<T>(api.current);
      },
    };
    return api;
  },
} as const;

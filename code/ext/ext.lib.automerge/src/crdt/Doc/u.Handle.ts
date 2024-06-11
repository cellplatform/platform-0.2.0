import { eventsFactory } from './Doc.Events';
import { Symbols, slug, toObject, type t } from './common';
import { Wrangle } from './u.Wrangle';

type O = Record<string, unknown>;

/**
 * Convert a DocRef → DocRefHandle.
 */
export function toHandle<T extends O>(doc: t.DocRef<T>) {
  return (doc as t.DocRefHandle<T>).handle;
}

export const Handle = {
  toHandle,

  /**
   * Wrap a raw automerge document-handle as a [DocRefHandle].
   */
  wrap<T extends O>(
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
      is: {
        get ready() {
          return handle.isReady();
        },
        get deleted() {
          return handle.isDeleted();
        },
      },
      change(fn, options) {
        handle.change((d: any) => fn(d), Wrangle.changeOptions(options));
      },
      events(dispose$) {
        return eventsFactory<T>(api, { dispose$: [options.dispose$, dispose$] });
      },
      toObject() {
        return toObject<T>(api.current);
      },
    };
    (api as any)[Symbols.kind] = Symbols.DocRef;
    return api;
  },
} as const;

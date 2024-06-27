import { eventsFactory } from './Doc.Events';
import { Symbols, slug, toObject, type t } from './common';
import { Wrangle } from './u.Wrangle';

type O = Record<string, unknown>;

/**
 * Convert a Doc<T> → DocWithHandle<T>.
 */
export function toHandle<T extends O>(doc: t.Doc<T>) {
  return (doc as t.DocWithHandle<T>).handle;
}

export const Handle = {
  toHandle,

  /**
   * Wrap a raw automerge document-handle as a [DocWithHandle].
   */
  wrap<T extends O>(
    handle: t.DocHandle<T>,
    options: { dispose$?: t.UntilObservable } = {},
  ): t.DocWithHandle<T> {
    const api: t.DocWithHandle<T> = {
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
    (api as any)[Symbols.kind] = Symbols.Doc;
    return api;
  },
} as const;

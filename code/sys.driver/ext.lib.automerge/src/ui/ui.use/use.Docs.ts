import { useEffect, useRef, useState } from 'react';
import { Is, R, rx, type t } from './common';
import { Redraw } from './use.Redraw';

type O = Record<string, unknown>;
type Ref<T extends O> = t.UriString | t.Doc<T>;
type RefsInput<T extends O> = Ref<T> | (Ref<T> | undefined)[];

/**
 * Retrieves documents by URI from a store.
 */
export function useDocs<T extends O>(
  store?: t.Store,
  refs?: RefsInput<T>,
  options: t.UseDocsOptions = {},
) {
  const { timeout } = options;
  const uris = wrangle.uris(refs);

  const redrawListeners = useRef(new Map<t.UriString, t.Lifecycle>());
  const [fetching, setFetching] = useState<t.UriString[]>([]);
  const [errors, setErrors] = useState<t.UseDocsError[]>([]);
  const [docs, setDocs] = useState<t.Doc<T>[]>([]);
  const [, setCount] = useState(0); // Redraw.

  const is = {
    ok: errors.length === 0,
    fetching: fetching.length > 0,
    ready: fetching.length === 0,
  } as const;

  /**
   * Fetching state helpers.
   */
  const Fetching = {
    remove: (uri: t.UriString) => setFetching((prev) => prev.filter((item) => item !== uri)),
    add: (uri: t.UriString) => setFetching((prev) => R.uniq([...prev, uri])),
  } as const;

  /**
   * Error state helpers.
   */
  const Errors = {
    remove: (uri: t.UriString) => setErrors((prev) => prev.filter((item) => item.uri !== uri)),
    add(uri: t.UriString, type: t.UseDocsErrorType, message: string = '') {
      Errors.remove(uri);
      setErrors((prev) => [...prev, { uri, type, message }]);
    },
  } as const;

  /**
   * Retrieved documents state helpers.
   */
  const Docs = {
    get listeners() {
      return redrawListeners.current;
    },

    remove(uri: t.UriString) {
      setDocs((prev) => prev.filter((doc) => doc.uri !== uri));
      Docs.listeners.get(uri)?.dispose();
      Docs.listeners.delete(uri);
    },
    add(doc: t.Doc<T>) {
      Docs.remove(doc.uri);
      setDocs((prev) => [...prev, doc]);

      const redraw = wrangle.redraw(options);
      if (redraw.required) {
        const inc = () => setCount((n) => n + 1);
        const listener = Redraw.onChange(doc, inc, redraw.options);
        Docs.listeners.set(doc.uri, listener);
      }
    },
  } as const;

  /**
   * Lifecycle.
   */
  useEffect(() => wrangle.docs<T>(refs).forEach((doc) => Docs.add(doc)), []); // Initial store of existing loaded documents.
  useEffect(() => setErrors([]), [uris.join()]);

  useEffect(() => {
    const life = rx.lifecycle();
    setDocs((prev) => prev.filter((doc) => uris.includes(doc.uri)));
    setFetching((prev) => {
      const loaded = docs.map(({ uri }) => uri as string);
      return prev.filter((fetching) => loaded.includes(fetching));
    });

    /**
     * Retrieve the given document from the store.
     */
    const fetch = async (store: t.Store, uri: t.UriString) => {
      Fetching.add(uri);
      try {
        const res = await store.doc.get<T>(uri, { timeout });
        if (!life.disposed) {
          if (!res) Errors.add(uri, 'NotFound', `Document not found: ${uri}`);
          else Docs.add(res);
        }
      } catch (error: any) {
        if (!life.disposed) Errors.add(uri, 'Unknown', error.message);
      }
      Fetching.remove(uri);
    };

    /**
     * Run loader(s).
     */
    if (store && uris.length > 0) {
      uris
        .filter((uri) => !docs.some((doc) => doc.uri === uri)) // ← NB: not already loaded.
        .filter((uri) => !fetching.includes(uri)) //              ← NB: not currently fetching.
        .forEach((uri) => fetch(store, uri));
    }
    return life.dispose;
  }, [!!store, uris.join()]);

  /**
   * API
   */
  return {
    count: uris.length,
    is,
    uris,
    refs: docs,
    fetching,
    errors,
  } as const;
}

/**
 * Helpers
 */
const wrangle = {
  list<T extends O>(refs?: RefsInput<T>): Ref<T>[] {
    if (!refs) return [];
    if (typeof refs === 'string') return [refs];
    if (Array.isArray(refs)) return refs.filter(Boolean).map((ref) => ref as Ref<T>);
    return [];
  },

  uris<T extends O>(refs?: RefsInput<T>) {
    return wrangle.list<T>(refs).map((ref) => (typeof ref === 'string' ? ref : ref.uri));
  },

  docs<T extends O>(refs?: RefsInput<T>) {
    const list = wrangle.list(refs);
    return list.filter((item) => Is.doc(item)) as t.Doc<T>[];
  },

  redraw(args: t.UseDocsOptions = {}) {
    const { redrawOnChange = true } = args;
    const isNumber = typeof redrawOnChange === 'number';
    const debounce = isNumber ? redrawOnChange : 100;
    const options: t.UseRedrawOnChangeOptions = { debounce };
    return {
      required: isNumber ? true : redrawOnChange,
      options,
    } as const;
  },
} as const;

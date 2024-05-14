import { useEffect, useState } from 'react';
import { Is, R, rx, type t } from './common';

type O = Record<string, unknown>;
type Ref<T extends O> = t.UriString | t.DocRef<T>;
type RefsInput<T extends O> = Ref<T> | (Ref<T> | undefined)[];
type Error = {
  uri: t.UriString;
  type: 'Timeout' | 'NotFound' | 'Unknown';
  message: string;
};

/**
 * Retrieves documents by URI from a store.
 */
export function useDocs<T extends O>(
  store?: t.Store,
  refs?: RefsInput<T>,
  options: { timeout?: t.Msecs } = {},
) {
  const { timeout } = options;
  const uris = wrangle.uris(refs);

  const [fetching, setFetching] = useState<t.UriString[]>([]);
  const [errors, setErrors] = useState<Error[]>([]);
  const [docs, setDocs] = useState<t.DocRef<T>[]>(wrangle.docs<T>(refs));
  const is = {
    ok: errors.length === 0,
    fetching: fetching.length > 0,
    ready: fetching.length === 0,
  } as const;

  /**
   * Lifecycle.
   */
  useEffect(() => setErrors([]), [uris.join()]);

  useEffect(() => {
    const life = rx.lifecycle();
    setDocs((prev) => prev.filter((doc) => uris.includes(doc.uri)));
    setFetching((prev) => {
      const loaded = docs.map(({ uri }) => uri as string);
      return prev.filter((fetching) => loaded.includes(fetching));
    });

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
      add(uri: t.UriString, type: Error['type'], message: string = '') {
        Errors.remove(uri);
        setErrors((prev) => [...prev, { uri, type, message }]);
      },
    } as const;

    /**
     * Retrieved documents state helpers.
     */
    const Docs = {
      remove: (uri: t.UriString) => setDocs((prev) => prev.filter((doc) => doc.uri !== uri)),
      add(doc: t.DocRef<T>) {
        Docs.remove(doc.uri);
        setDocs((prev) => [...prev, doc]);
      },
    } as const;

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
    return list.filter((item) => Is.docRef(item)) as t.DocRef<T>[];
  },
} as const;

import { useEffect, useState } from 'react';
import { Is, rx, type t } from './common';

type O = Record<string, unknown>;

/**
 * Retrieves a doc (by URI) from a store.
 */
export function useDoc<T extends O>(
  store?: t.Store,
  ref?: t.UriString | t.DocRef<T>,
  options: { timeout?: t.Msecs } = {},
) {
  const { timeout } = options;
  const uri = typeof ref === 'string' ? ref : undefined;

  const [fetching, setFetching] = useState(false);
  const [doc, setDoc] = useState<t.DocRef<T>>();

  useEffect(() => {
    const life = rx.lifecycle();
    if (store && uri && uri !== doc?.uri) {
      setFetching(true);
      store?.doc.get<T>(uri, { timeout }).then((doc) => {
        if (life.disposed) return;
        setFetching(false);
        if (doc?.uri === uri) setDoc(doc);
      });
    }
    return life.dispose;
  }, [!!store, uri]);

  /**
   * API
   */
  return {
    store,
    fetching,
    doc: Is.docRef(ref) ? ref : doc,
  } as const;
}

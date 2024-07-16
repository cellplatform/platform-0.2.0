import { type t } from './common';
import { useDocs } from './use.Docs';

type O = Record<string, unknown>;
type D<T extends O> = t.UriString | t.Doc<T>;

/**
 * Retrieves a doc (by URI) from a store.
 */
export function useDoc<T extends O>(store?: t.Store, ref?: D<T>, options: t.UseDocsOptions = {}) {
  const docs = useDocs<T>(store, ref, options);
  return {
    is: docs.is,
    uri: docs.uris[0],
    ref: docs.refs[0],
    fetching: docs.fetching[0],
    error: docs.errors[0],
  } as const;
}

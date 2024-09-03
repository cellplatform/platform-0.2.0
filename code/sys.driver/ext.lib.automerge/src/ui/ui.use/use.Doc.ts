import { Is, type t } from './common';
import { useDocs } from './use.Docs';

type O = Record<string, unknown>;
type Ref<T extends O> = t.UriString | t.Doc<T>;

/**
 * Retrieves a doc (by URI) from a store.
 */
export function useDoc<T extends O>(
  store?: t.Store,
  ref?: Ref<T>,
  options?: t.UseDocsOptions,
): t.UseDoc<T> {
  const docs = useDocs<T>(Is.doc(ref) ? ref : { uri: ref, store }, options);
  return {
    is: docs.is,
    ref: docs.refs[0],
    fetching: docs.fetching[0],
    error: docs.errors[0],
  };
}

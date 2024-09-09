import { useDocs, type t } from './common';
import { Data } from './u';

type UriRef = { uri?: t.UriString; store?: t.Store };

/**
 * Hook that performs clean-up on the raw input {data}.
 */
export function useDocuments(data?: t.InfoData, repos?: t.InfoRepos): t.UseDocs {
  const defaultRepo = data?.repo ?? '';
  const documents = Data.documents(data?.document);
  const getStore = (name?: string) => repos?.[name ?? defaultRepo]?.store;
  const toRef = (doc: t.InfoDoc): UriRef => ({ uri: doc.uri, store: getStore(doc.repo) });
  return useDocs(documents.map(toRef));
}

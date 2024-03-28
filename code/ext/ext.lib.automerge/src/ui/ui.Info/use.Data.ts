import { useDoc } from '../use';
import { type t } from './common';

/**
 * Hook that performs clean-up on the raw input {data}.
 */
export function useData(data?: t.InfoData): t.InfoData {
  const store = data?.repo?.store;
  const document = useDoc(store, data?.document?.doc);
  const history = useDoc(store, data?.history?.doc);
  if (!data) return {};
  return {
    ...data,
    document: { ...data.document, doc: document.doc },
    history: { ...data.history, doc: history.doc },
  };
}

import { useDocs } from '../../ui.use';
import { Is, type t } from './common';
import { Data } from './u';

/**
 * Hook that performs clean-up on the raw input {data}.
 */
export function useData(data?: t.InfoData): t.InfoData {
  const document = useDocuments(data);
  if (!data) return {};
  return { ...data, document } as const;
}

/**
 * CRDT DocRef loader that swaps loads and swaps out any
 * URI references with the actual retrieved documents.
 */
function useDocuments(data?: t.InfoData): t.InfoDataDoc[] {
  const list = Data.document.list(data?.document);
  const store = data?.repo?.store;
  const docs = useDocs(
    store,
    list.map((item) => item.ref),
    { redrawOnChange: true },
  );
  return list
    .map((item) => ({ ...item, ref: wrangle.ref(item, docs.refs) }))
    .filter((item) => !!item.ref);
}

/**
 * Helpers
 */
const wrangle = {
  ref(data: t.InfoDataDoc, docs: t.DocRef[]) {
    if (!data.ref) return undefined;
    if (Is.docRef(data.ref)) return data.ref;
    return docs.find((item) => item.uri === data.ref);
  },
} as const;

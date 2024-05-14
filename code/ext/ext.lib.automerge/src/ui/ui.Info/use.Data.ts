import { useDocs } from '../use';
import { Is, type t } from './common';
import { WrangleData } from './u';

/**
 * Hook that performs clean-up on the raw input {data}.
 */
export function useData(data?: t.InfoData): t.InfoData {
  const document = useDocuments(data);
  if (!data) return {};
  return { ...data, document } as const;
}

function useDocuments(data?: t.InfoData): t.InfoDataDoc[] {
  const list = WrangleData.asDocArray(data);
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

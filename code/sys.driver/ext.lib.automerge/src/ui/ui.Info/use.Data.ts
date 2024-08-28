import { useDocs } from '../../ui/ui.use';
import { Is, type t } from './common';
import { Data } from './u';

type UriRef = { uri: t.UriString; store: t.Store };

/**
 * Hook that performs clean-up on the raw input {data}.
 */
export function useData(data?: t.InfoData, repos?: t.InfoRepos): t.InfoData {
  const document = useDocuments(data, repos);
  if (!data) return {};
  return { ...data, document } as const;
}

/**
 * CRDT Doc<T> loader that swaps loads and swaps out any
 * uri references with the actual retrieved documents.
 */
function useDocuments(data?: t.InfoData, repos: t.InfoRepos = {}): t.InfoDoc[] {
  const list = Data.document.list(data?.document);

  const toRef = (item: t.InfoDoc): t.Doc | UriRef | undefined => {
    if (Is.doc(item.ref)) return item.ref;
    const uri = item.ref!;
    const store = repos[item.repo ?? '']?.store!;
    return uri && store ? { uri, store } : undefined;
  };

  const fromRefs = (data: t.InfoDoc, refs: t.Doc[]) => {
    if (!data.ref) return undefined;
    if (Is.doc(data.ref)) return data.ref;
    return refs.find((item) => item.uri === data.ref);
  };

  const refs = list.map((item) => toRef(item)).filter(Boolean);
  const docs = useDocs(refs, { redrawOnChange: true });
  return list
    .map((item) => ({ ...item, ref: fromRefs(item, docs.refs) }))
    .filter((item) => !!item.ref);
}

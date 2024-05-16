import { AutomergeInfo, type t } from './common';

const Field = AutomergeInfo.Field;

/**
 * Shared network state (transient document).
 */
export function shared(
  data: t.InfoData,
  ref?: t.DocRef<t.CrdtShared>,
  theme?: t.CommonTheme,
): t.PropListItem[] {
  const network = data.network;
  const res: t.PropListItem[] = [];
  if (!network || !data.shared) return res;

  const shared = Array.isArray(data.shared) ? data.shared : [data.shared];
  shared
    .filter(Boolean)
    .map((shared) => ({ ...shared, ref }))
    .map((shared) => Field.document(shared, ['Doc', 'Doc.URI', 'Doc.Object'], theme))
    .forEach((fields) => res.push(...fields));

  return res;
}

import { AutomergeInfo, type t, DEFAULTS } from './common';

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
  if (!network) return res;

  const toDocument = (shared: t.InfoDataDoc): t.InfoDataDoc => {
    const label = shared.label ?? DEFAULTS.shared.label;
    const dotMeta = shared.object?.dotMeta ?? DEFAULTS.shared.dotMeta;
    return {
      ...shared,
      ref,
      label,
      object: { ...shared.object, dotMeta },
    };
  };

  const Field = AutomergeInfo.Field;
  const shared = Array.isArray(data.shared) ? data.shared : [data.shared];
  shared
    .map((shared) => toDocument(shared ?? {}))
    .map((shared) => Field.document(shared, ['Doc', 'Doc.URI', 'Doc.Object'], theme))
    .forEach((fields) => res.push(...fields));

  return res;
}

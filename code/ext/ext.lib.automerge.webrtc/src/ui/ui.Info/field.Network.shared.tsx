import { AutomergeInfo, DEFAULTS, type t } from './common';

/**
 * Shared network state (transient document).
 */
export function shared(
  ctx: t.InfoFieldCtx,
  data: t.InfoData,
  ref?: t.DocRef<t.CrdtShared>,
): t.PropListItem[] {
  const network = data.network;
  const res: t.PropListItem[] = [];

  if (!network) return res;
  const { store, index } = network;

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

  const toInfoComponent = (document: t.InfoDataDoc) => {
    return (
      <AutomergeInfo
        stateful={ctx.stateful}
        fields={['Doc', 'Doc.URI', 'Doc.Object']}
        data={{ repo: { store, index }, document }}
        theme={ctx.theme}
        style={{ flex: 1 }}
      />
    );
  };

  const shared = Array.isArray(data.shared) ? data.shared : [data.shared];
  shared
    .map((shared) => toDocument(shared ?? {}))
    .map((shared) => toInfoComponent(shared))
    .forEach((value) => res.push({ value }));

  return res;
}

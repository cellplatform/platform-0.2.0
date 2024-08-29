import { AutomergeInfo, DEFAULTS, type t } from './common';

/**
 * Shared network state (transient document).
 */
export function shared(
  ctx: t.InfoCtx,
  data: t.InfoData,
  network?: t.NetworkStore,
  ref?: t.Doc<t.CrdtShared>,
): t.PropListItem[] {
  const res: t.PropListItem[] = [];
  if (!network) return res;

  const toDocument = (shared: t.InfoDoc): t.InfoDoc => {
    const label = shared.label ?? DEFAULTS.shared.label;
    const dotMeta = shared.object?.dotMeta ?? DEFAULTS.shared.dotMeta;
    return {
      ...shared,
      ref,
      label,
      object: { ...shared.object, dotMeta, visible: false },
    };
  };

  const shared = Array.isArray(data.shared) ? data.shared : [data.shared];
  const document = shared.map((shared) => toDocument(shared ?? {}));

  if (document.length > 0) {
    const value = (
      <AutomergeInfo
        fields={['Doc', 'Doc.URI', 'Doc.Object']}
        data={{ repo: 'main', document }}
        repos={{ main: network.repo }}
        theme={ctx.theme}
        style={{ flex: 1 }}
      />
    );
    res.push({ value });
  }

  return res;
}

import { CrdtInfo, DEFAULTS, Doc, type t } from './common';

/**
 * Shared network state (transient document).
 */
export function shared(
  ctx: t.InfoCtx,
  data: t.InfoData,
  network?: t.NetworkStore,
): t.PropListItem[] {
  const res: t.PropListItem[] = [];
  if (!network) return res;

  const controller = ctx.internal?.shared;
  const config = wrangle.data(data, network, controller);

  const value = (
    <CrdtInfo
      theme={ctx.theme}
      style={{ flex: 1 }}
      repos={{ [DEFAULTS.repo]: network.repo }}
      fields={['Doc', 'Doc.URI', 'Doc.Object']}
      enabled={ctx.enabled}
      data={config}
      {...controller?.handlers}
    />
  );
  res.push({ value });

  return res;
}

/**
 * Helpers
 */
const wrangle = {
  data(
    data: t.InfoData,
    network: t.NetworkStore,
    controller?: t.CrdtInfoStatefulController,
  ): t.CrdtInfoData {
    const uri = network.shared.doc.uri;
    const d = controller ? controller.data?.document : data.shared;
    const document = CrdtInfo.Data.documents(d).map((item) => ({ ...item, uri }));
    return {
      repo: DEFAULTS.repo,
      document,
    };
  },
} as const;

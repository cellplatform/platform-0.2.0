import { AutomergeInfo, type t } from './common';

/**
 * Delegate to the base Automerge library.
 */
export function repo(ctx: t.InfoCtx, network?: t.NetworkStore) {
  if (!network) return undefined;

  const value = (
    <AutomergeInfo.Stateful
      theme={ctx.theme}
      fields={['Repo']}
      data={{ repo: 'main' }}
      repos={{ main: network.repo }}
      style={{ flex: 1 }}
    />
  );
  return { value };
}

import { type t } from './common';
import { FarcasterLink } from './ui.Farcaster.Link';

type Args = t.InfoFieldArgs;

/**
 * https://docs.privy.io/guide/guides/farcaster-login
 */
export function farcasterIdentity(args: Args): t.PropListItem | undefined {
  const { privy, modifiers, theme } = args;
  const data = args.data.farcaster;
  const showClose = modifiers.is.over && modifiers.keys.alt;

  let enabled = args.enabled;
  if (!privy.ready || !privy.authenticated) enabled = false;

  return {
    label: 'Farcaster',
    value: (
      <FarcasterLink
        theme={theme}
        privy={privy}
        enabled={enabled}
        showClose={showClose}
        onClick={data?.onClick}
      />
    ),
  };
}

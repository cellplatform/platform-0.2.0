import { type t } from './common';
import { FarcasterSigner } from './ui.Farcaster.Signer';

type Args = t.InfoFieldArgs & { fc: t.Farcaster };

/**
 * https://docs.privy.io/guide/react/recipes/misc/farcaster-writes
 */
export function farcasterSigner(args: Args): t.PropListItem | undefined {
  const { privy, modifiers, theme, fc } = args;
  const data = args.data.farcaster?.signer;

  let enabled = args.enabled;
  if (!privy.ready || !privy.authenticated) enabled = false;

  return {
    label: data?.label || 'Farcaster Signer',
    value: <FarcasterSigner enabled={enabled} fc={fc} theme={theme} modifiers={modifiers} />,
  };
}

import { type t } from './common';
import { FCLink } from './ui.FC.Link';

/**
 * https://docs.privy.io/guide/guides/farcaster-login
 */
export function linkFarcaster(args: {
  privy: t.PrivyInterface;
  enabled: boolean;
  modifiers: t.InfoFieldModifiers;
}): t.PropListItem | undefined {
  const { privy, modifiers } = args;
  const showClose = modifiers.is.over && modifiers.keys.alt;

  let enabled = args.enabled;
  if (!privy.ready || !privy.authenticated) enabled = false;

  return {
    label: 'Farcaster',
    value: <FCLink privy={privy} enabled={enabled} showClose={showClose} />,
  };
}

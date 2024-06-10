import { type t } from './common';
import { Farcaster } from './ui.Row.Farcaster';
import { FarcasterSigner } from './ui.Row.Farcaster.Signer';

type Args = t.InfoFieldArgs & { fc: t.Farcaster };

/**
 * https://docs.privy.io/guide/guides/farcaster-login
 */
export function farcaster(args: Args): t.PropListItem[] {
  const { privy, modifiers, theme, fc } = args;
  const data = args.data.farcaster;
  const showClose = modifiers.is.over && modifiers.keys.alt;
  const hasSigner = !!fc.account?.signerPublicKey;

  let enabled = args.enabled;
  if (!privy.ready || !privy.authenticated) enabled = false;

  const res: t.PropListItem[] = [];

  /**
   * Identity.
   */
  res.push({
    label: data?.identity?.label || 'Farcaster',
    value: (
      <Farcaster
        fc={fc}
        privy={privy}
        theme={theme}
        enabled={enabled}
        showClose={showClose}
        spinning={data?.identity?.spinning}
        onClick={data?.identity?.onClick}
      />
    ),
  });

  /**
   * Signer
   */
  if (data?.signer && (!hasSigner || data.signer.forceVisible)) {
    res.push({
      label: data?.signer.label || 'Farcaster Signer',
      value: <FarcasterSigner enabled={enabled} fc={fc} theme={theme} modifiers={modifiers} />,
    });
  }

  // Finish up.
  return res;
}

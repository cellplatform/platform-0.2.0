import { DEFAULTS, type t } from './common';
import { Farcaster } from './ui.Row.Farcaster';
import { FarcasterSigner } from './ui.Row.Farcaster.Signer';

type Args = t.InfoFieldArgs & {
  cmd?: t.Cmd<t.FarcasterCmd>;
  hasAccount?: boolean;
  hasSigner?: boolean;
};
const DEF = DEFAULTS.props;
const DEFAULT = DEF.data.farcaster as t.InfoDataFarcaster;

/**
 * https://docs.privy.io/guide/guides/farcaster-login
 */
export function farcaster(args: Args): t.PropListItem[] {
  const { privy, modifiers, theme, cmd, hasAccount, hasSigner } = args;
  const data = args.data.farcaster;
  const showClose = modifiers.is.over && modifiers.keys.alt;

  let enabled = args.enabled;
  if (!privy.ready || !privy.authenticated) enabled = false;

  const res: t.PropListItem[] = [];

  /**
   * FC: Identity.
   */
  res.push({
    label: data?.identity?.label || DEFAULT.identity?.label,
    value: (
      <Farcaster
        privy={privy}
        theme={theme}
        enabled={enabled}
        hasSigner={hasSigner}
        showClose={showClose}
        showFid={data?.identity?.fid}
        spinning={data?.identity?.spinning}
        onClick={data?.identity?.onClick}
      />
    ),
  });

  /**
   * FC: Signer.
   */
  if (data?.signer?.forceVisible || (data?.signer && hasAccount && !hasSigner)) {
    res.push({
      label: data?.signer.label || DEFAULT.signer!.label,
      value: <FarcasterSigner enabled={enabled} cmd={cmd} theme={theme} modifiers={modifiers} />,
    });
  }

  // Finish up.
  return res;
}

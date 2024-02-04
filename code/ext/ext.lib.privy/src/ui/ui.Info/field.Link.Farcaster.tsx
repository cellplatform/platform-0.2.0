import { Button, COLORS, type t } from './common';

/**
 * https://docs.privy.io/guide/guides/farcaster-login
 */
export function linkFarcaster(
  privy: t.PrivyInterface,
  data: t.InfoData,
  fields: t.InfoField[],
  enabled: boolean,
): t.PropListItem | undefined {
  if (!privy.ready || !privy.authenticated) enabled = false;

  /**
   * TODO 🐷 BUG: not working
   *    Service error: "there was a problem" after login from Warpcast.
   *    See conversation at: https://privy-developers.slack.com/archives/C059ABLSB47/p1707088424465269
   */

  /**
   * Handlers
   */
  const linkFarcaster = () => {
    if (!enabled) return;
    privy.linkFarcaster();
  };

  /**
   * Render
   */
  const color = enabled ? COLORS.BLUE : COLORS.DARK;
  const elButton = (
    <Button style={{ color }} label={'Link'} enabled={enabled} onClick={linkFarcaster} />
  );

  return {
    label: 'Farcaster',
    value: elButton,
  };
}

import { Button, COLORS, type t } from './common';
import { FCUsername } from './ui.FC.Username';

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
  const fc = privy.user?.farcaster;
  const isAuthenticated = !!fc;

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
  const elLogin = !isAuthenticated && (
    <Button style={{ color }} label={'Connect'} enabled={enabled} onClick={linkFarcaster} />
  );

  const elUsername = isAuthenticated && <FCUsername data={fc} />;

  return {
    label: 'Farcaster',
    value: {
      data: elLogin || elUsername,
      clipboard() {
        if (!fc) return;
        return `https://warpcast.com/${fc.username}`;
      },
    },
  };
}

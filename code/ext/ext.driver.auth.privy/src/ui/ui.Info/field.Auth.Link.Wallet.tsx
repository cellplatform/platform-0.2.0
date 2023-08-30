import { Button, COLORS, type t } from './common';

export function FieldLinkWallet(
  privy: t.PrivyInterface,
  wallets: t.ConnectedWallet[],
  enabled: boolean,
): t.PropListItem | undefined {
  if (!privy.ready || !privy.authenticated) enabled = false;
  if (wallets.length === 0) enabled = false;

  /**
   * Handlers
   */
  const linkWallet = () => {
    if (enabled) privy.linkWallet();
  };

  /**
   * Render
   */
  const color = enabled ? COLORS.BLUE : COLORS.DARK;
  const value = (
    <Button style={{ color }} label={'Connect'} enabled={enabled} onClick={linkWallet} />
  );

  return {
    label: 'Link Wallet',
    value,
  };
}

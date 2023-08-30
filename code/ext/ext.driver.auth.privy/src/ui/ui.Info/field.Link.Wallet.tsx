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
  const connectAndLink = () => {
    if (!enabled) return;

    /**
     * TODO 🐷
     *  Figure this out.
     *  https://docs.privy.io/guide/frontend/wallets/multiwallet#linking-multiple-wallets
     */

    // wallets[0].loginOrLink();
    // privy.connectWallet();
  };

  /**
   * Render
   */
  const color = enabled ? COLORS.BLUE : COLORS.DARK;
  const value = (
    <Button style={{ color }} label={'Connect'} enabled={enabled} onClick={connectAndLink} />
  );

  return {
    label: 'Link Wallet (TBD)',
    value,
  };
}

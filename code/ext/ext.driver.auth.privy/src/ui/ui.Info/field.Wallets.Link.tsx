import { Button, COLORS, Value, type t } from './common';

export function FieldLinkWallet(
  privy: t.PrivyInterface,
  wallets: t.ConnectedWallet[],
  fields: t.InfoField[],
  enabled: boolean,
): t.PropListItem | undefined {
  if (!privy.ready || !privy.authenticated) enabled = false;
  if (wallets.length === 0) enabled = false;

  /**
   * Handlers
   */
  const linkWallet = () => {
    if (!enabled) return;
    privy.linkWallet();
  };

  /**
   * Render
   */
  const color = enabled ? COLORS.BLUE : COLORS.DARK;
  const value = <Button style={{ color }} label={'Add'} enabled={enabled} onClick={linkWallet} />;

  let label = Value.plural(wallets.length, 'Wallet', 'Wallets');
  if (!fields.includes('Wallets.List') && wallets.length > 1) {
    label = `${label} (${wallets.length})`;
  }

  return {
    label,
    value,
  };
}

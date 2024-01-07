import { Button, Chain, COLORS, Value, type t } from './common';
import { Wrangle } from './Wrangle';

export function linkWallet(
  privy: t.PrivyInterface,
  data: t.InfoData,
  wallets: t.ConnectedWallet[],
  fields: t.InfoField[],
  enabled: boolean,
): t.PropListItem | undefined {
  if (!privy.ready || !privy.authenticated) enabled = false;
  if (wallets.length === 0) enabled = false;
  const chain = Wrangle.chain(data);

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
  if (!fields.includes('Wallet.List') && wallets.length > 1) label = `${label} (${wallets.length})`;
  if (!fields.includes('Chain.List')) label = `${label} - Chain: ${Chain.displayName(chain)}`;

  return {
    label,
    value,
  };
}

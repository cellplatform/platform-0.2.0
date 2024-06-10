import { Button, Chain, COLORS, Icons, Value, type t } from './common';
import { Wrangle } from './u';

type Args = t.InfoFieldArgs & { wallets: t.ConnectedWallet[] };

export function walletLink(args: Args): t.PropListItem | undefined {
  const { privy, data, wallets, fields, theme } = args;
  let enabled = args.enabled;
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
  const value = (
    <Button style={{ color }} enabled={enabled} onClick={linkWallet} theme={theme}>
      <Icons.Add size={16} margin={[0, 2, 0, 0]} />
    </Button>
  );

  let label = Value.plural(wallets.length, 'Wallet', 'Wallets');
  if (!fields.includes('Wallet.List') && wallets.length > 1) label = `${label} (${wallets.length})`;
  if (!fields.includes('Chain.List')) label = `${label} - ${Chain.displayName(chain)}`;

  return {
    label,
    value,
  };
}

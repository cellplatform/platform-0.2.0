import { Button, DEFAULTS, Hash, Icons, css, type t } from './common';
import { useBalance } from './ui.Wallet.useBalance';

export type WalletProps = {
  enabled?: boolean;
  privy: t.PrivyInterface;
  wallet: t.ConnectedWallet;
  style?: t.CssValue;
};

export const Wallet: React.FC<WalletProps> = (props) => {
  const { enabled = DEFAULTS.enabled, wallet, privy } = props;
  const { address } = wallet;
  const shortHash = Hash.shorten(address, [2, 4], { divider: '..' });
  const balance = useBalance(wallet);

  /**
   * Handlers
   */
  const copyAddress = () => {
    window.navigator.clipboard.writeText(address);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr auto',
      gridGap: '5px',
    }),
    kind: css({
      opacity: 0.2,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Icons.Wallet size={17} opacity={0.8} offset={[0, -2]} />
      <div>
        <Button enabled={enabled} onClick={copyAddress}>
          {shortHash}
        </Button>
      </div>
      <div {...styles.kind}>{Wrangle.walletClientType(wallet)}</div>
      <div>{balance.toString('ETH', 4)}</div>
    </div>
  );
};

/**
 * Helpers
 */
export const Wrangle = {
  walletClientType(wallet: t.ConnectedWallet) {
    const type = wallet.walletClientType;
    if (type === 'privy') return 'embedded';
    return type.replace(/_/, ' ').toLocaleLowerCase();
  },
} as const;

import { Button, DEFAULTS, Hash, Icons, css, type t } from './common';
import { useBalance } from './ui.Wallet.useBalance';

export type WalletProps = {
  enabled?: boolean;
  privy: t.PrivyInterface;
  wallet: t.ConnectedWallet;
  showClose?: boolean;
  style?: t.CssValue;
};

export const Wallet: React.FC<WalletProps> = (props) => {
  const { enabled = DEFAULTS.enabled, wallet, showClose = false, privy } = props;
  const { address } = wallet;
  const isEmbedded = Wrangle.isEmbedded(wallet);

  const shortHash = Hash.shorten(address, [2, 4], { divider: '..' });
  const balance = useBalance(wallet);

  /**
   * Handlers
   */
  const copyAddress = () => {
    window.navigator.clipboard.writeText(address);
  };

  const unlinkWallet = () => {
    /**
     * TODO 🐷
     * Bug: not working
     * https://privy-developers.slack.com/archives/C059ABLSB47/p1693530998199469
     */
    privy.unlinkWallet(wallet.address);
    wallet.unlink();
  };

  /**
   * [Render]
   */
  const Size = 16;
  const styles = {
    base: css({
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr auto ',
      gridGap: '5px',
      justifyContent: 'center',
      alignContent: 'center',
    }),
    wallet: css({}),
    kind: css({
      opacity: 0.2,
      display: 'grid',
      alignContent: 'center',
    }),
    address: css({
      display: 'grid',
      alignContent: 'center',
    }),
    close: css({ Size }),
  };

  const elAddress = (
    <Button enabled={enabled} onClick={copyAddress} style={styles.address}>
      {shortHash}
    </Button>
  );

  const elClose = showClose && !isEmbedded && (
    <Button style={styles.close} enabled={enabled} onClick={unlinkWallet}>
      <Icons.Close size={Size} />
    </Button>
  );
  const elBalance = !elClose && <div>{balance.toString('ETH', 5)}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      <Icons.Wallet size={16} opacity={0.8} offset={[0, 0]} style={styles.wallet} />
      {elAddress}
      <div {...styles.kind}>{Wrangle.walletClientType(wallet)}</div>
      {elClose || elBalance}
    </div>
  );
};

/**
 * Helpers
 */
export const Wrangle = {
  isEmbedded(wallet: t.ConnectedWallet) {
    return wallet.walletClientType === 'privy';
  },

  walletClientType(wallet: t.ConnectedWallet) {
    if (Wrangle.isEmbedded(wallet)) return 'embedded';
    return wallet.walletClientType.replace(/_/, ' ').toLocaleLowerCase();
  },
} as const;

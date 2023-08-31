import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Icons, Hash, Button } from './common';

import { createWalletClient, createPublicClient, custom, formatEther } from 'viem';
import { mainnet } from 'viem/chains';

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

  const [balance, setBalance] = useState(-1);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const life = rx.lifecycle();

    /**
     * TODO 🐷
     * Refactor
     */
    async function init() {
      const ethereumProvider = await wallet.getEthereumProvider();
      if (life.disposed) return;

      const account = wallet.address as any;
      const walletClient = createWalletClient({
        account,
        chain: mainnet,
        transport: custom(ethereumProvider),
      });

      const publicClient = createPublicClient({
        chain: mainnet,
        transport: custom(ethereumProvider),
      });

      const res = await publicClient.getBalance({ address: account });
      if (life.disposed) return;

      const eth = Number.parseFloat(formatEther(res));
      setBalance(eth);
    }

    init();
    return life.dispose;
  }, [wallet.address, wallet.connectorType, wallet.walletClientType, wallet.chainId]);

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
    kind: css({ opacity: 0.2 }),
  };

  const copyAddress = () => {
    window.navigator.clipboard.writeText(address);
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Icons.Wallet size={17} opacity={0.8} offset={[0, -2]} />
      <div>
        <Button onClick={copyAddress}>{shortHash}</Button>
      </div>
      <div {...styles.kind}>{Wrangle.walletClientType(wallet)}</div>
      <div>{balance < 0 ? `-` : `${balance.toFixed(4)} ETH`}</div>
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

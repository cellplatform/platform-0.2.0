import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Icons, Hash } from './common';

export type WalletProps = {
  enabled?: boolean;
  privy: t.PrivyInterface;
  wallet: t.ConnectedWallet;
  style?: t.CssValue;
};

export const Wallet: React.FC<WalletProps> = (props) => {
  const { enabled = DEFAULTS.enabled, wallet, privy } = props;

  const { address } = wallet;
  const short = Hash.shorten(address, [6, 4], { divider: '..' });

  /**
   * Lifecycle
   */
  useEffect(() => {
    //
    console.log('wallet', wallet);

    /**
     * TODO 🐷
     */
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.05)' /* RED */,
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr',
      gridGap: '5px',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Icons.Wallet size={17} opacity={0.6} offset={[0, -2]} />
      <div>{short}</div>
      <div>{wallet.walletClientType}</div>
    </div>
  );
};

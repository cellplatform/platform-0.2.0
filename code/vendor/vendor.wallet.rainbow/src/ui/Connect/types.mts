import { type t } from './common';

export type ConnectProps = {
  config: t.ConnectConfig;
  chains?: t.ChainName[];
  autoload?: boolean;
  style?: t.CssValue;
};

export type ConnectConfig = {
  /**
   * App name.
   */
  appName: string;

  /**
   * WalletConnect Cloud project.
   * https://cloud.walletconnect.com/
   */
  projectId: string; // WalletConnect Cloud project. https://cloud.walletconnect.com/
};

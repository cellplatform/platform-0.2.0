import { css, type t } from '../common';
import { useImports } from './useImports.mjs';

export type ConnectProps = {
  appName: string;
  projectId: string; // WalletConnect Cloud project ID. https://cloud.walletconnect.com/
  autoload?: boolean;
  style?: t.CssValue;
};

/**
 * A wallet connect button.
 * https://www.rainbowkit.com/docs
 */
export const Connect: React.FC<ConnectProps> = (props) => {
  const { autoload = true, appName, projectId } = props;

  const imports = useImports({ appName, projectId, autoload });
  if (!imports.ready) return null;

  const { WagmiConfig, RainbowKit } = imports;
  if (!WagmiConfig?.Component) return null;
  if (!WagmiConfig?.data) return null;
  if (!RainbowKit?.ConnectButton) return null;
  if (!RainbowKit?.Provider) return null;
  if (!RainbowKit?.chains) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <WagmiConfig.Component config={WagmiConfig.data}>
        <RainbowKit.Provider chains={RainbowKit.chains}>
          <RainbowKit.ConnectButton />
        </RainbowKit.Provider>
      </WagmiConfig.Component>
    </div>
  );
};

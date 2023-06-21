import { css, type t } from '../common';
import { useImports } from './useImports.mjs';

export type ConnectProps = {
  autoload?: boolean;
  style?: t.CssValue;
};

/**
 * A wallet connect button
 */
export const Connect: React.FC<ConnectProps> = (props) => {
  const { autoload = true } = props;
  const appName = 'Foo';
  const projectId = '4d190498d1b5bc687c6118ed29015c65'; // TEMP 🐷

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

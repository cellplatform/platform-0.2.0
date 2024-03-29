/**
 * Configuration
 * NOTE: You may need to copy this style import in up-stream host.
 */
import '@rainbow-me/rainbowkit/styles.css';

/**
 * Imports.
 */
import { lightTheme } from '@rainbow-me/rainbowkit';
import { Loading } from './Root.Loading';
import { DEFAULTS, FC, css, type t } from './common';
import { useConfigImport } from './useConfigImport.mjs';
import { ChainSelector } from '../ChainSelector';

/**
 * A wallet connect button.
 * https://www.rainbowkit.com/docs
 */
const View: React.FC<t.ConnectProps> = (props) => {
  const { config, autoload = DEFAULTS.autoload, chains = DEFAULTS.chains.default } = props;

  /**
   * Load dynamic (code-split) imports.
   */
  const imports = useConfigImport({ config, autoload, chains });
  const { Wagmi, RainbowKit } = imports;

  const elLoading = <Loading />;
  if (!imports.ready) return elLoading;
  if (!Wagmi?.ConfigProvider) return elLoading;
  if (!Wagmi?.config) return elLoading;
  if (!RainbowKit?.ConnectButton) return elLoading;
  if (!RainbowKit?.Provider) return elLoading;
  if (!RainbowKit?.chains) return elLoading;

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
  };

  const theme = lightTheme({
    // https://www.rainbowkit.com/docs/theming
    borderRadius: 'medium',
    fontStack: 'system',
  });

  return (
    <div {...css(styles.base, props.style)}>
      <Wagmi.ConfigProvider config={Wagmi.config}>
        <RainbowKit.Provider chains={RainbowKit.chains} theme={theme}>
          <RainbowKit.ConnectButton />
        </RainbowKit.Provider>
      </Wagmi.ConfigProvider>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  ChainSelector: typeof ChainSelector;
};
export const Connect = FC.decorate<t.ConnectProps, Fields>(
  View,
  { DEFAULTS, ChainSelector },
  { displayName: 'Connect' },
);

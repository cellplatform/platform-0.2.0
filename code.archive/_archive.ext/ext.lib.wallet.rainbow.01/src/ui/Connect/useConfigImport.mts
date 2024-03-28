import { useEffect, useState } from 'react';
import { configure } from '../../config';
import { type t, DEFAULTS } from './common';

/**
 * Hook for dynamically importing code-split libs.
 */
export function useConfigImport(args: {
  config: t.ConnectConfig;
  chains: t.ChainName[];
  autoload?: boolean;
}) {
  const { chains } = args;
  const { appName, projectId } = args.config;
  const [config, setConfig] = useState<t.ConfigureResponse>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    if (args.autoload) {
      configure({ appName, projectId, chains }).then(setConfig);
    }
  }, [appName, projectId, args.autoload, chains.join(',')]);

  const Wagmi = {
    ConfigProvider: config?.WagmiConfig,
    config: config?.wagmiConfig,
  };

  const RainbowKit = {
    Provider: config?.RainbowKitProvider,
    ConnectButton: config?.RainbowConnectButton,
    chains: config?.chains,
  };

  /**
   * API
   */
  const api = {
    ready: Boolean(config),
    Wagmi,
    RainbowKit,
  } as const;

  return api;
}

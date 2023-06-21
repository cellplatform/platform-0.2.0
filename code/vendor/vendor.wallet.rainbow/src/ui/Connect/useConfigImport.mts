import { useEffect, useState } from 'react';
import { configure } from '../../config';
import { type t } from '../common';

/**
 * Hook for dynamically importing code-split libs.
 */
export function useConfigImport(args: { config: t.ConnectConfig; autoload?: boolean }) {
  const { appName, projectId } = args.config;
  const [config, setConfig] = useState<t.ConfigureResponse>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    if (args.autoload) {
      configure({ appName, projectId }).then((res) => setConfig(res));
    }
  }, [appName, projectId, args.autoload]);

  const Wagmi = {
    ConfigProvider: config?.WagmiConfig,
    config: config?.wagmiConfig,
  };

  const RainbowKit = {
    Provider: config?.RainbowKitProvider,
    ConnectButton: config?.ConnectButton,
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

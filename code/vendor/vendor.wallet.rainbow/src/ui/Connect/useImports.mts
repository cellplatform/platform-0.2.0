import { useEffect, useState } from 'react';
import { configure } from '../../config';
import { type t } from '../common';

/**
 * Hook for dynamically importing code-split libs.
 */
export function useImports(args: { appName: string; projectId: string; autoload?: boolean }) {
  const { appName, projectId } = args;
  const [config, setConfig] = useState<t.ConfigureResponse>();

  /**
   * Lifecycle.
   */
  useEffect(() => {
    if (args.autoload) {
      configure({ appName, projectId }).then((res) => setConfig(res));
    }
  }, [appName, projectId, args.autoload]);

  /**
   * API
   */
  return {
    ready: Boolean(config),
    appName,
    projectId,
    WagmiConfig: {
      Component: config?.WagmiConfig,
      data: config?.wagmiConfig,
    },
    RainbowKit: {
      ConnectButton: config?.ConnectButton,
      Provider: config?.RainbowKitProvider,
      chains: config?.chains,
    },
  } as const;
}

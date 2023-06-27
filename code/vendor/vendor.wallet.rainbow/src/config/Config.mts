import { Import } from './Config.Import.mjs';
import { ChainNameMapping, type t } from './common';

/**
 * Dynamically load (code-split) modules and configure
 * the wallet, chain connections and UI components.
 *
 * See:
 *    https://www.rainbowkit.com/docs/installation#manual-setup
 */
export async function configure(args: {
  appName: string;
  projectId: string;
  chains: t.ChainName[];
}) {
  const { appName, projectId } = args;
  const evm = await Import.modules();

  /**
   * Docs:
   *  - https://wagmi.sh/react/chains
   *  - https://www.rainbowkit.com/docs/chains
   *
   * Available chains:
   *  - https://wagmi.sh/react/chains#supported-chains
   *
   */
  const { chains, publicClient } = evm.configureChains(
    ChainNameMapping.filterAndOrder(evm.chains, args.chains, 'EVM.L1.mainnet'),
    [
      // Eth.alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
      evm.publicProvider(),
    ],
  );

  const { connectors } = evm.getDefaultWallets({ appName, projectId, chains });

  const wagmiConfig = evm.createConfig({
    autoConnect: true,
    publicClient,
    connectors,
  });

  /**
   * API
   */
  const { WagmiConfig, RainbowKitProvider, RainbowConnectButton } = evm;
  return {
    connectors,
    chains,
    wagmiConfig,
    WagmiConfig,
    RainbowKitProvider,
    RainbowConnectButton,
  } as const;
}

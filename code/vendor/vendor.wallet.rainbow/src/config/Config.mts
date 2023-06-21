import { Import } from './Config.Import.mjs';

/**
 * Dynamically load (code-split) modules and configure
 * the wallet, chain connections and UI components.
 *
 * See:
 *    https://www.rainbowkit.com/docs/installation#manual-setup
 */
export async function configure(args: { appName: string; projectId: string }) {
  const { appName, projectId } = args;
  const eth = await Import.all();

  /**
   * Docs:
   *  - https://wagmi.sh/react/chains
   *  - https://www.rainbowkit.com/docs/chains
   *
   * Available chains:
   *  - https://wagmi.sh/react/chains#supported-chains
   *
   */
  const { chains, publicClient } = eth.configureChains(
    [eth.mainnet, eth.polygon, eth.optimism, eth.arbitrum],
    [
      // Eth.alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
      eth.publicProvider(),
    ],
  );

  const { connectors } = eth.getDefaultWallets({ appName, projectId, chains });

  const wagmiConfig = eth.createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  /**
   * API
   */
  const { WagmiConfig, RainbowKitProvider, ConnectButton } = eth;
  return {
    connectors,
    chains,
    wagmiConfig,
    WagmiConfig,
    RainbowKitProvider,
    ConnectButton,
  } as const;
}

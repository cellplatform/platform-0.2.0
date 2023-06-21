import { Import } from './Config.Import.mjs';

/**
 * Dynamically load and configure the wallet and chain connections
 */
export async function configure(args: { appName: string; projectId: string }) {
  const { appName, projectId } = args;
  const eth = await Import.all();

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

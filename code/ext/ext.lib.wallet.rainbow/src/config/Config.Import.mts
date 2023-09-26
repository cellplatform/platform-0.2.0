import { type t } from './common';

/**
 * 🐷 Hack: avoid type export error.
 */
type ImportType = {
  walletModules: () => Promise<any>;
  wagmi: () => Promise<any>;
  chains: () => Promise<any>;
  alchemy: () => Promise<any>;
  public: () => Promise<any>;
  rainbow: () => Promise<any>;
};

/**
 * Dynamic importing of dependencies (code-splitting).
 * See:
 *    https://www.rainbowkit.com/docs/installation#manual-setup
 */
export const Import: ImportType = {
  async walletModules() {
    // Load all dependencies in parallel
    const promise = {
      wagmi: Import.wagmi(),
      chains: Import.chains(),
      alchemy: Import.alchemy(),
      public: Import.public(),
      rainbow: Import.rainbow(),
    };
    await Promise.all([promise.wagmi, promise.chains, promise.alchemy, promise.public]);

    // Unwrap dependencies
    // NB: already resolved by this point(↑), await is used for typescript convenience.
    return {
      ...(await promise.wagmi),
      chains: await promise.chains,
      ...(await promise.alchemy),
      ...(await promise.public),
      ...(await promise.rainbow),
    };
  },

  async wagmi() {
    const { configureChains, createConfig, WagmiConfig } = await import('wagmi');
    return { configureChains, createConfig, WagmiConfig };
  },

  async chains(): Promise<t.WagmiChain[]> {
    const { mainnet, polygon, optimism, arbitrum } = await import('wagmi/chains');
    return [mainnet, polygon, optimism, arbitrum];
  },

  async alchemy() {
    const { alchemyProvider } = await import('wagmi/providers/alchemy');
    return { alchemyProvider };
  },

  async public() {
    const { publicProvider } = await import('wagmi/providers/public');
    return { publicProvider };
  },

  async rainbow() {
    const {
      //
      getDefaultWallets,
      RainbowKitProvider,
      ConnectButton: RainbowConnectButton,
    } = await import('@rainbow-me/rainbowkit');
    return { getDefaultWallets, RainbowKitProvider, RainbowConnectButton };
  },
};

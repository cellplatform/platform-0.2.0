/**
 * Dynamic importing of dependencies (code-splitting).
 * See:
 *    https://www.rainbowkit.com/docs/installation#manual-setup
 */
export const Import = {
  async all() {
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
      ...(await promise.chains),
      ...(await promise.alchemy),
      ...(await promise.public),
      ...(await promise.rainbow),
    };
  },

  async wagmi() {
    const { configureChains, createConfig, WagmiConfig } = await import('wagmi');
    return { configureChains, createConfig, WagmiConfig };
  },

  async chains() {
    const { mainnet, polygon, optimism, arbitrum } = await import('wagmi/chains');
    return { mainnet, polygon, optimism, arbitrum };
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
    const { getDefaultWallets, RainbowKitProvider, ConnectButton } = await import(
      '@rainbow-me/rainbowkit'
    );
    return { getDefaultWallets, RainbowKitProvider, ConnectButton };
  },
};

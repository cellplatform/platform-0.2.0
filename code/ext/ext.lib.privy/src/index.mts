/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

export { PrivyProvider, usePrivy } from '@privy-io/react-auth';

/**
 * Library
 */
export { Auth } from './ui/ui.Auth';
export { Info } from './ui/ui.Info';
export { Chain, Wallet, Balance } from './evm';
export { AuthEnv } from './common';

/**
 * Dev
 */
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};

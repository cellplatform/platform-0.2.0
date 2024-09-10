import { Chain, Pkg, type t } from '../common';

export { useFarcasterSigner, usePrivy, useWallets } from '@privy-io/react-auth';
export { Farcaster } from '../../u.farcaster';
export * from '../common';

/**
 * Constants
 */
const loginMethods: t.AuthProviderLoginMethods = ['sms'];

const fields = {
  get all(): t.InfoField[] {
    return [
      'Module',
      'Module.Verify',
      'Id.User',
      'Id.User.Phone',
      'Id.App.Privy',
      'Id.App.WalletConnect',
      'Login',
      'Login.SMS',
      'Login.Farcaster',
      'AccessToken',
      'Wallet.Link',
      'Wallet.List',
      'Wallet.List.Title',
      'Chain.List',
      'Chain.List.Title',
      'Chain.List.Testnets',
      'Farcaster',
      'Refresh',
      'Refresh.Label',
    ];
  },
  get default(): t.InfoField[] {
    return ['Module', 'Id.User', 'Login', 'Wallet.Link'];
  },
} as const;

const data: t.InfoData = {
  chain: {
    names: Chain.names,
    selected: 'Op:Main',
  },
  farcaster: {
    identity: { label: 'Farcaster' },
    signer: { label: 'Farcaster Signer' },
  },
};

export const DEFAULTS = {
  displayName: `${Pkg.name}:Info`,
  query: { dev: 'dev' },
  fields,
  data,
  clipboard: true,
  loginMethods,
} as const;

import { Chain, Pkg, type t } from '../common';

export { useFarcasterSigner, usePrivy, useWallets } from '@privy-io/react-auth';
export { Farcaster } from '../../u.farcaster';
export * from '../common';

type P = t.InfoProps;

/**
 * Constants
 */
const name = 'Info';
const props: t.PickRequired<P, 'theme' | 'enabled' | 'fields' | 'clipboard' | 'data'> = {
  theme: 'Light',
  enabled: true,
  clipboard: true,
  get fields() {
    return fields.default;
  },
  get data() {
    return { ...data };
  },
};

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
  name,
  displayName: `${Pkg.name}:${name}`,
  query: { dev: 'dev' },
  props,
  fields,
  loginMethods,
} as const;

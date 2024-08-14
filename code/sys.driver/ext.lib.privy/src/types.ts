import type { User as AuthUser, PrivyInterface } from '@privy-io/react-auth';
export type { AuthUser, PrivyInterface };

/**
 * Internal
 */
export type * from './u.evm/Balance/t';
export type * from './u.evm/Chain/t';
export type * from './u.evm/Wallet/t';

export type * from './ui/ui.Auth.Provider/t';
export type * from './ui/ui.Auth/t';
export type * from './ui/ui.Info/t';

export type * from './fn/fn.farcaster/t';

/**
 * Authentication
 */
export type AuthEnvKey = 'VITE_PUBLIC_PRIVY_APP_ID' | 'VITE_WALLET_CONNECT_PROJECT_ID';
export type AuthStatus = {
  ready: boolean;
  authenticated: boolean;
  user?: AuthUser;
};

import type { User as AuthUser } from '@privy-io/react-auth';

export type * from './evm/Balance/types';
export type * from './evm/Chain/types';
export type * from './ui/ui.Auth/types';
export type * from './ui/ui.Info/types';
export type * from './ui/ui.Sample/types';

export { AuthUser };

export type AuthStatus = {
  ready: boolean;
  authenticated: boolean;
  user?: AuthUser;
};

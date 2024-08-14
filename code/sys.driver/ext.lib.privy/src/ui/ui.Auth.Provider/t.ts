import type { t } from './common';
import type { PrivyClientConfig } from '@privy-io/react-auth';

export type AuthProviderLoginMethods = Required<PrivyClientConfig['loginMethods']>;

/**
 * Component
 */
export type AuthProviderProps = {
  children?: JSX.Element | never[];
  appId?: string;
  walletConnectId?: string;
  loginMethods?: AuthProviderLoginMethods;
  logoUrl?: string;
  onSuccess?: t.AuthProviderSuccessHandler;
};

/**
 * Events
 */
export type AuthProviderSuccessHandler = (e: AuthProviderSuccessHandlerArgs) => void;
export type AuthProviderSuccessHandlerArgs = {
  user: t.AuthUser;
  isNewUser: boolean;
};

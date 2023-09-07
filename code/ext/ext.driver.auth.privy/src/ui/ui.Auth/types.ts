import type { t } from './common';

/**
 * Component
 */
export type AuthProviderProps = {
  children?: JSX.Element | never[];
  appId?: string;
  walletConnectId?: string;
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

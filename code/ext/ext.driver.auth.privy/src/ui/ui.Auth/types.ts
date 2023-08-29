import type { t } from './common';

export type AuthLoginMethod = 'wallet' | 'sms';

/**
 * Component
 */
export type AuthProviderProps = {
  children?: JSX.Element | never[];
  appId?: string;
  walletConnectId?: string;
  logoUrl?: string;
  loginMethods?: t.AuthLoginMethod[];
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

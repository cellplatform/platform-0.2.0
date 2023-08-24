import { PrivyProvider } from '@privy-io/react-auth';
import { COLORS, DEFAULTS, FC, type t } from './common';

const View: React.FC<t.AuthProviderProps> = (props) => {
  const { appId, loginMethods = DEFAULTS.loginMethods } = props;
  if (!appId) return '⚠️ AuthProvider missing "appId"';
  if (loginMethods.length === 0) return '⚠️ AuthProvider must have at least one login method.';

  /**
   * [Render]
   */
  return (
    <PrivyProvider
      appId={appId}
      onSuccess={(user, isNewUser) => props.onSuccess?.({ user, isNewUser })}
      config={{
        loginMethods,
        appearance: {
          theme: 'light',
          accentColor: COLORS.BLUE,
          showWalletLoginFirst: false,
          logo: 'https://user-images.githubusercontent.com/185555/262834108-4efb7e56-ac2a-4fcb-b747-2e1245df09e0.png',
        },
      }}
    >
      {props.children}
    </PrivyProvider>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const AuthProvider = FC.decorate<t.AuthProviderProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'AuthProvider' },
);

import { PrivyProvider } from '@privy-io/react-auth';
import { COLORS, DEFAULTS, FC, type t } from './common';
import { useStylesOverride } from './use.StylesOverride';

const View: React.FC<t.AuthProviderProps> = (props) => {
  const { appId, loginMethods = DEFAULTS.loginMethods, logoUrl = DEFAULTS.logoUrl } = props;

  useStylesOverride();

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
        walletConnectCloudProjectId: props.walletConnectId,
        appearance: {
          theme: 'light',
          accentColor: COLORS.BLUE,
          showWalletLoginFirst: false,
          logo: logoUrl,
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

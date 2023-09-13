import { PrivyProvider } from '@privy-io/react-auth';
import { COLORS, DEFAULTS, FC, type t } from './common';
import { useStyleOverrides } from './use.StyleOverrides';

const View: React.FC<t.AuthProviderProps> = (props) => {
  const { appId, logoUrl: logo = DEFAULTS.logoUrl } = props;
  useStyleOverrides();

  if (!appId) return '⚠️ AuthProvider missing "appId"';

  /**
   * [Render]
   */
  return (
    <PrivyProvider
      appId={appId}
      onSuccess={(user, isNewUser) => props.onSuccess?.({ user, isNewUser })}
      config={{
        loginMethods: ['sms'], // NB: Start with phone (embedded wallet), then progressively add other wallets later.
        walletConnectCloudProjectId: props.walletConnectId,
        appearance: {
          logo,
          theme: 'light',
          accentColor: COLORS.BLUE,
          showWalletLoginFirst: false,
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

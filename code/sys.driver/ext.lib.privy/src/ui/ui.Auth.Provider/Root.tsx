import { PrivyProvider, type PrivyClientConfig } from '@privy-io/react-auth';
import { COLORS, DEFAULTS, FC, type t } from './common';
import { useStyleOverrides } from './use.StyleOverrides';

const View: React.FC<t.AuthProviderProps> = (props) => {
  const { appId } = props;
  useStyleOverrides();

  if (!appId) return '⚠️ AuthProvider missing "appId"';
  const defaultCountry = DEFAULTS.defaultCountry;

  const config: PrivyClientConfig = {
    loginMethods: props.loginMethods ?? DEFAULTS.loginMethods,
    walletConnectCloudProjectId: props.walletConnectId,
    intl: { defaultCountry },
    appearance: {
      theme: 'light',
      logo: props.logoUrl ?? DEFAULTS.logoUrl,
      accentColor: COLORS.BLUE,
      showWalletLoginFirst: false,
    },
  };

  /**
   * [Render]
   */
  return (
    <PrivyProvider
      appId={appId}
      config={config}
      onSuccess={(user, isNewUser) => props.onSuccess?.({ user, isNewUser })}
    >
      {props.children}
    </PrivyProvider>
  );
};

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const AuthProvider = FC.decorate<t.AuthProviderProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: DEFAULTS.displayName },
);

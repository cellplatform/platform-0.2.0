import { AuthProvider } from '../ui.Auth/Auth.Provider';
import { DEFAULTS, type t } from './common';
import { Builder } from './ui.Builder';

export const View: React.FC<t.InfoProps> = (props) => {
  const { data = DEFAULTS.data, useAuthProvider = DEFAULTS.useAuthProvider } = props;

  if (!useAuthProvider) return <Builder {...props} />;

  return (
    <AuthProvider appId={data.provider?.appId} walletConnectId={data.provider?.walletConnectId}>
      <Builder {...props} />
    </AuthProvider>
  );
};

import { AuthProvider } from '../ui.Auth/Auth.Provider';
import { DEFAULTS, t } from './common';
import { ListBuilder } from './ui.Builder';

export const View: React.FC<t.InfoProps> = (props) => {
  const { data = DEFAULTS.data, useAuthProvider = DEFAULTS.useAuthProvider } = props;

  if (!useAuthProvider) return <ListBuilder {...props} />;

  return (
    <AuthProvider appId={data.provider?.appId} walletConnectId={data.provider?.walletConnectId}>
      <ListBuilder {...props} />
    </AuthProvider>
  );
};

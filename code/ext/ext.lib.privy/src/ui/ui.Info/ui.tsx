import { AuthProvider } from '../ui.Auth/Auth.Provider';
import { DEFAULTS, type t } from './common';
import { Builder } from './ui.Builder';

export const View: React.FC<t.InfoProps> = (props) => {
  const { fields = [], data = DEFAULTS.data } = props;

  return (
    <AuthProvider appId={data.provider?.appId} walletConnectId={data.provider?.walletConnectId}>
      <Builder {...props} />
    </AuthProvider>
  );
};

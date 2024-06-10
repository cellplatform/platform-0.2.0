import { AuthProvider } from '../ui.Auth/Auth.Provider';
import { DEFAULTS, PropList, type t } from './common';
import { Wrangle } from './u';
import { Builder } from './ui.Builder';

export const View: React.FC<t.InfoProps> = (props) => {
  const { data = DEFAULTS.data } = props;
  const fields = PropList.fields(props.fields);
  return (
    <AuthProvider
      appId={data.provider?.appId}
      walletConnectId={data.provider?.walletConnectId}
      loginMethods={Wrangle.loginMethods(fields)}
    >
      <Builder {...props} />
    </AuthProvider>
  );
};

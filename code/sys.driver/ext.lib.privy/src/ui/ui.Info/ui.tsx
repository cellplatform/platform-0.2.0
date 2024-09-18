import { DEFAULTS, PropList, type t } from './common';
import { Wrangle } from './u';
import { Builder } from './ui.Builder';
import { AuthProvider } from '../ui.Auth.Provider';

const DEF = DEFAULTS.props;

export const View: React.FC<t.InfoProps> = (props) => {
  const { data = DEF.data } = props;
  const fields = PropList.fields(props.fields);
  const loginMethods = Wrangle.loginMethods(fields);
  const { appId, walletConnectId } = data.provider ?? {};

  return (
    <AuthProvider appId={appId} walletConnectId={walletConnectId} loginMethods={loginMethods}>
      <Builder {...props} />
    </AuthProvider>
  );
};

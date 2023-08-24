import { AuthProvider } from '../ui.Auth/Auth.Provider';
import { Wrangle } from './Wrangle';
import { DEFAULTS, t } from './common';
import { List } from './ui.List';

export const View: React.FC<t.InfoProps> = (props) => {
  const {
    fields = DEFAULTS.fields.default,
    data = DEFAULTS.data,
    useAuthProvider = DEFAULTS.useAuthProvider,
  } = props;

  if (!useAuthProvider) return <List {...props} />;

  return (
    <AuthProvider
      appId={data.provider?.appId}
      loginMethods={Wrangle.toLoginMethods(fields)}
      onSuccess={data.provider?.onSuccess}
    >
      <List {...props} />
    </AuthProvider>
  );
};

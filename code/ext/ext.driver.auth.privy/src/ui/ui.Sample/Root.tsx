import { DEFAULTS, FC, css, type t } from './common';
import { Auth } from '../ui.Auth';

import { PrivyProvider, type User } from '@privy-io/react-auth';
import { SampleLogin } from './ui.Login';

const View: React.FC<t.SampleProps> = (props) => {
  const { appId } = props;
  if (!appId) return <div>{`⚠️ missing appId`}</div>;

  const handleLogin = (user: User, isNewUser: boolean) => {
    console.log(`User ${user.id} logged in!`);
    console.log('isNewUser', isNewUser);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ padding: 15 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Auth.Provider
        appId={appId}
        onSuccess={(e) => {
          console.info(`User ${e.user.id} logged in!`);
          console.info('isNewUser', e.isNewUser);
        }}
        // config={{
        //   loginMethods: ['email', 'sms', 'wallet'],
        //   appearance: {
        //     theme: 'light',
        //     accentColor: '#676FFF',
        //     logo: 'https://db.team/images/ro.png',
        //     showWalletLoginFirst: false,
        //   },
        // }}
      >
        <SampleLogin />
      </Auth.Provider>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Root = FC.decorate<t.SampleProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Sample.Privy' },
);

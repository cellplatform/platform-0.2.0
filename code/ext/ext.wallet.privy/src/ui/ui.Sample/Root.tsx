import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

import { PrivyProvider, type User } from '@privy-io/react-auth';
import { Login } from './ui.Login';

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
      <PrivyProvider
        appId={appId}
        onSuccess={handleLogin}
        config={{
          loginMethods: ['email', 'sms', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://db.team/images/ro.png',
            showWalletLoginFirst: false,
          },
        }}
      >
        <Login />
      </PrivyProvider>
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

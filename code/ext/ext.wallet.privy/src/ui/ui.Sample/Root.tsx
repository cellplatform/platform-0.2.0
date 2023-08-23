import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

import { PrivyProvider, type User } from '@privy-io/react-auth';
console.log('PrivyProvider', PrivyProvider);

const View: React.FC<t.SampleProps> = (props) => {
  const { appId } = props;
  if (!appId) return <div>{`⚠️ missing appId`}</div>;

  const handleLogin = (user: User, isNewUser: boolean) => {
    console.log(`User ${user.id} logged in!`);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 5,
    }),
  };

  const el = `🐷 Hello Privy`;

  return (
    <div {...css(styles.base, props.style)}>
      <PrivyProvider
        appId={appId}
        onSuccess={handleLogin}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://your-logo-url',
          },
        }}
      >
        {el}
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

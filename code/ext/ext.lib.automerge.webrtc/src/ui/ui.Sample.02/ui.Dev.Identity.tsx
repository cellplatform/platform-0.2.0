import { Auth } from 'ext.lib.privy';
import { css, type t } from '../common';

export type AuthIdentityProps = {
  style?: t.CssValue;
  jwt?: string;
  onAccessToken?: (jwt: string) => void;
};

export const AuthIdentity: React.FC<AuthIdentityProps> = (props) => {
  const { jwt } = props;
  const styles = { base: css({}) };
  return (
    <div {...css(styles.base, props.style)}>
      <Auth.Info
        title={'Identity'}
        fields={[
          'Login',
          'AccessToken',
          'Login.SMS',
          'Login.Farcaster',
          'Link.Farcaster',
          'Wallet.List',
          'Wallet.List.Title',
          'Refresh',
        ]}
        data={{
          provider: Auth.Env.provider,
          accessToken: { jwt },
          wallet: { list: { title: 'Public Key' } },
        }}
        onChange={(e) => {
          if (e.accessToken) props.onAccessToken?.(e.accessToken);
        }}
      />
    </div>
  );
};

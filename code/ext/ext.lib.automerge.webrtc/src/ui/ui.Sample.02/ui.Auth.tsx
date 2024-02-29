import { Auth } from 'ext.lib.privy';
import { css, type t } from '../common';

export type AuthLoginProps = {
  style?: t.CssValue;
  onAccessToken?: (jwt: string) => void;
};

export const AuthLogin: React.FC<AuthLoginProps> = (props) => {
  const styles = { base: css({}) };
  return (
    <div {...css(styles.base, props.style)}>
      <Auth.Info
        title={'Identity'}
        fields={['Login', 'Login.SMS', 'Login.Farcaster', 'Id.User', 'Link.Farcaster']}
        data={{ provider: Auth.Env.provider }}
        onChange={(e) => {
          if (e.accessToken) props.onAccessToken?.(e.accessToken);
        }}
      />
    </div>
  );
};

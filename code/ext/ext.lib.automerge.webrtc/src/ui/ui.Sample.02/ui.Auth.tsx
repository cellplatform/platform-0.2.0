import { Auth } from 'ext.lib.privy';
import { css, type t } from '../common';

export type AuthLoginProps = {
  style?: t.CssValue;
  jwt?: string;
  onAccessToken?: (jwt: string) => void;
};

export const AuthLogin: React.FC<AuthLoginProps> = (props) => {
  const { jwt } = props;
  const styles = { base: css({}) };
  return (
    <div {...css(styles.base, props.style)}>
      <Auth.Info
        title={'Identity'}
        fields={['Login', 'AccessToken', 'Login.SMS', 'Login.Farcaster', 'Link.Farcaster']}
        data={{
          provider: Auth.Env.provider,
          accessToken: { jwt },
        }}
        onChange={(e) => {
          if (e.accessToken) props.onAccessToken?.(e.accessToken);
        }}
      />
    </div>
  );
};

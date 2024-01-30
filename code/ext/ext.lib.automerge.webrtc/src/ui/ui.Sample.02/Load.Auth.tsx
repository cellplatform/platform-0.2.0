import { Auth } from 'ext.lib.privy';
import { css, type t } from './common';

export type AuthLoaderProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const AuthLoader: React.FC<AuthLoaderProps> = (props) => {
  const styles = { base: css({}) };
  return (
    <div {...css(styles.base, props.style)}>
      <Auth.Info
        fields={[
          'Auth.Login',
          'Id.User',
          'Id.User.Phone',
          'Auth.Link.Wallet',
          'Wallet.List',
          'Wallet.List.Title',
          'Refresh',
        ]}
        data={{
          provider: Auth.Env.provider,
          wallet: { list: { title: 'Public Key' } },
        }}
        onChange={(e) => console.info('⚡️ Auth.onChange:', e)}
      />
    </div>
  );
};

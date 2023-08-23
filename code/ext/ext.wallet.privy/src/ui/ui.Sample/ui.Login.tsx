import { Button, COLORS, Color, css, type t } from './common';

import { usePrivy } from '@privy-io/react-auth';
import { ObjectView } from 'sys.ui.react.common';

export type LoginProps = {
  style?: t.CssValue;
};

export const Login: React.FC<LoginProps> = (props) => {
  const privy = usePrivy();

  console.log('privy', privy);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    buttons: css({
      lineHeight: 1.5,
    }),
    button: css({ color: COLORS.BLUE }),
    obj: css({
      marginTop: 20,
      paddingTop: 20,
      borderTop: `solid 5px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
  };

  const data = {
    ready: privy.ready,
    user: privy.user,
    authenticated: privy.authenticated,
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.buttons}>
        <Button onClick={privy.login} style={styles.button} block={true}>{`Login`}</Button>
        <Button onClick={privy.logout} style={styles.button} block={true}>{`Logout`}</Button>
      </div>
      <div {...styles.obj}>
        <ObjectView name={'privy'} data={data} expand={1} />
      </div>
    </div>
  );
};

import type { Farcaster } from '@privy-io/react-auth';
import { Button, css, type t } from './common';

export type FCUsernameProps = {
  user: Farcaster;
  style?: t.CssValue;
  onClick?: t.InfoFarcasterClickHandler;
};

export const FCUsername: React.FC<FCUsernameProps> = (props) => {
  const { user } = props;

  /**
   * Handlers
   */
  const handleClick = () => props.onClick?.({ user });

  /**
   * Render
   */
  const styles = {
    base: css({ height: 19 }),
    body: css({
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: 'auto auto',
      columnGap: '6px',
    }),

    pfp: css({ Size: 16, borderRadius: 16 }),
  };

  const elBody = (
    <div {...styles.body}>
      <div>{`${user.username}`}</div>
      {user.pfp && <img src={user.pfp} {...styles.pfp} />}
    </div>
  );

  const elButtonBody = props.onClick && <Button onClick={handleClick}>{elBody}</Button>;

  return <div {...css(styles.base, props.style)}>{elButtonBody || elBody}</div>;
};

import type { Farcaster } from '@privy-io/react-auth';
import { Button, css, type t } from './common';

export type FCUsernameProps = {
  user: Farcaster;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: t.InfoFarcasterClickHandler;
};

export const FCUsername: React.FC<FCUsernameProps> = (props) => {
  const { user, theme, onClick } = props;

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
      <div>
        <span {...css({ opacity: 0.4 })}>{'@'}</span>
        <span>{`${user.username}`}</span>
      </div>
      {user.pfp && <img src={user.pfp} {...styles.pfp} />}
    </div>
  );

  let el = elBody;
  if (onClick)
    el = (
      <Button onClick={handleClick} theme={theme}>
        {elBody}
      </Button>
    );

  return (
    <div {...css(styles.base, props.style)}>
      {el}
      {/* {!onClick && elBody}
      {onClick && (
        <Button onClick={handleClick} theme={theme}>
          {elBody}
        </Button>
      )}

      {!props.onClick ? (
        elBody
      ) : (
        <Button onClick={handleClick} theme={theme}>
          {elBody}
        </Button>
      )} */}
    </div>
  );
};

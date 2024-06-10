import { Button, Color, css, type t } from './common';

export type FarcasterUsernameProps = {
  user: t.FarcasterUser;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: t.InfoFarcasterClickHandler;
};

export const FarcasterUsername: React.FC<FarcasterUsernameProps> = (props) => {
  const { user, theme, onClick } = props;

  /**
   * Handlers
   */
  const handleClick = () => props.onClick?.({ user });

  /**
   * Render
   */
  const color = Color.theme(theme).fg;
  const styles = {
    base: css({ height: 19, color }),
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
      <div title={`fid:${user.fid}`}>
        <span {...css({ opacity: 0.4 })}>{'@'}</span>
        <span>{`${user.username}`}</span>
      </div>
      {user.pfp && <img src={user.pfp} {...styles.pfp} />}
    </div>
  );

  let el = elBody;
  if (onClick) {
    el = (
      <Button onClick={handleClick} theme={theme}>
        {elBody}
      </Button>
    );
  }

  return <div {...css(styles.base, props.style)}>{el}</div>;
};

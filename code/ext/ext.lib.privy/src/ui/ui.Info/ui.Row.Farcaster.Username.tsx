import { Button, Color, Icons, Spinner, css, type t } from './common';

export type FarcasterUsernameProps = {
  fc: t.Farcaster;
  user: t.FarcasterUser;
  theme?: t.CommonTheme;
  spinning?: boolean;
  style?: t.CssValue;
  onClick?: t.InfoFarcasterClickHandler;
};

export const FarcasterUsername: React.FC<FarcasterUsernameProps> = (props) => {
  const { user, fc, onClick, spinning = false } = props;
  const hasSigner = !!fc.account?.signerPublicKey;

  /**
   * Handlers
   */
  const handleClick = () => props.onClick?.({ user, fc });

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const color = theme.fg;
  const styles = {
    base: css({ position: 'relative', height: 19, color }),
    body: css({
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: `repeat(${hasSigner ? 3 : 2}, auto)`,
      columnGap: '6px',
      opacity: spinning ? 0 : 1,
    }),
    pfp: css({ Size: 16, borderRadius: 16 }),
    spinner: css({ Absolute: 0, display: 'grid', alignContent: 'center', justifyContent: 'end' }),
  };

  const elIcon = <Icons.Signature size={18} color={color} />;

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Bar color={color} width={30} />
    </div>
  );

  const elBody = (
    <div {...styles.body}>
      <div title={`fid:${user.fid}`}>
        <span {...css({ opacity: 0.4 })}>{'@'}</span>
        <span>{`${user.username}`}</span>
      </div>
      {user.pfp && <img src={user.pfp} {...styles.pfp} />}
      {hasSigner && elIcon}
    </div>
  );

  let el = elBody;
  if (onClick) {
    el = (
      <Button onClick={handleClick} theme={theme.name} enabled={!spinning}>
        {elBody}
      </Button>
    );
  }

  return (
    <div {...css(styles.base, props.style)}>
      {el}
      {elSpinner}
    </div>
  );
};

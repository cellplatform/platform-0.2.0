import { Button, Color, COLORS, css, Spinner, type t } from './common';

export type ConnectButtonProps = {
  isSpinning?: boolean;
  canConnect?: boolean;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
};

export const ConnectButton: React.FC<ConnectButtonProps> = (props) => {
  const { canConnect, isSpinning } = props;

  /**
   * [Render]
   */
  const transition = 'all 150ms ease-out';
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: canConnect ? COLORS.MAGENTA : undefined,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.08)}`,
      transition,
      borderRadius: 4,
      display: 'grid',
      placeItems: 'center',

      fontSize: 11,
      color: COLORS.WHITE,
      userSelect: 'none',
    }),
    inner: css({ position: 'relative', transition }),
    label: css({
      Padding: [4, 14],
      opacity: isSpinning ? 0 : 1,
      fontSize: 10,
    }),
    spinner: css({
      Absolute: 0,
      transition,
      display: 'grid',
      placeItems: 'center',
      opacity: isSpinning ? 1 : 0,
    }),
  };

  const elSpinner = (
    <div {...styles.spinner}>
      <Spinner.Bar width={20} color={COLORS.WHITE} />
    </div>
  );

  return (
    <Button
      style={css(styles.base, props.style)}
      enabled={canConnect && !isSpinning}
      disabledOpacity={isSpinning ? 0.8 : 1}
      onClick={props.onClick}
    >
      <div {...styles.inner}>
        <div {...styles.label}>{'Connect'}</div>
        {elSpinner}
      </div>
    </Button>
  );
};

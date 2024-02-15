import { COLORS, Color, Filesize, Spinner, css, useTransmitMonitor, type t } from './common';

export type HandleProps = {
  edge: t.NetworkConnectionEdgeKind;
  bytes?: number;
  style?: t.CssValue;
};

export const Handle: React.FC<HandleProps> = (props) => {
  const { edge, bytes = 0 } = props;
  const is = { left: edge === 'Left', right: edge === 'Right' } as const;
  const label = bytes > 0 ? Filesize(bytes) : undefined;
  const { isTransmitting } = useTransmitMonitor(bytes);

  /**
   * Render
   */
  const CIRCLE_SIZE = 10;
  const CIRCLE_BORDER = 5;
  const COLOR = isTransmitting ? COLORS.MAGENTA : COLORS.DARK;
  const SECS = 0.5;
  const styles = {
    base: css({
      display: 'grid',
      alignContent: 'center',
    }),
    body: css({ display: 'grid', alignContent: 'center', gridTemplateColumns: 'auto auto' }),
    bar: css({
      width: 30,
      height: 6,
      backgroundColor: Color.alpha(COLOR, 0.2),
      transition: `background-color ${SECS}s`,
      alignSelf: 'center',
    }),
    head: css({
      Size: CIRCLE_SIZE,
      position: 'relative',
      borderRadius: '100%',
      border: `solid ${CIRCLE_BORDER}px ${Color.alpha(COLOR, 0.2)}`,
      transition: `border-color ${SECS}s`,
      display: 'grid',
      justifyContent: 'center',
    }),
    label: css({
      position: 'relative',
      fontSize: 9,
      fontFamily: 'monospace',
      letterSpacing: -0.1,
      top: -22,
      width: 60,
      textAlign: 'center',
      overflow: 'hidden',
      opacity: isTransmitting ? 0.65 : 0.3,
      color: COLOR,
      transition: `border-color ${SECS}s, opacity ${SECS}s`,
      cursor: 'default',
    }),
    spinner: css({
      Absolute: 0 - CIRCLE_BORDER * 3,
      display: 'grid',
      placeItems: 'center',
      opacity: isTransmitting ? 1 : 0,
      transition: `opacity ${SECS}s`,
    }),
  };

  const elSpinner = (
    <div {...styles.spinner}>
      <Spinner.Puff size={CIRCLE_SIZE * 1.2} color={Color.alpha(COLORS.MAGENTA, 0.8)} />
    </div>
  );

  const elBar = <div {...styles.bar}></div>;
  const elHead = (
    <div {...styles.head}>
      {elSpinner}
      {label && <div {...styles.label}>{label}</div>}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        {is.left ? elBar : elHead}
        {is.left ? elHead : elBar}
      </div>
    </div>
  );
};

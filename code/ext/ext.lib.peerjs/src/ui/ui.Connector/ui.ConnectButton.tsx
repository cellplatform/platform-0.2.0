import { COLORS, Color, Spinner, css, useMouse, type t } from './common';

export type ConnectButtonProps = {
  label?: string;
  selected?: boolean;
  focused?: boolean;
  spinning?: boolean;
  style?: t.CssValue;
};

export const ConnectButton: React.FC<ConnectButtonProps> = (props) => {
  const { spinning = true, label = 'Connect', selected = false, focused = false } = props;
  const mouse = useMouse();

  /**
   * [Render]
   */
  const isBlue = selected && focused;
  let color = COLORS.DARK as string;
  if (isBlue) color = COLORS.WHITE;

  const borderAlpha = mouse.is.over && selected ? 0.8 : isBlue ? 0.4 : 0.2;

  const styles = {
    base: css({
      position: 'relative',
      fontSize: 10,
      Padding: [3, 10],
      color,
      backgroundColor: Color.alpha(color, focused ? 0.06 : 0.0),
      border: `solid 1px ${Color.alpha(color, borderAlpha)}`,
      borderRadius: 4,
      userSelect: 'none',
    }),
    spinner: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      pointerEvents: 'none',
    }),
    label: css({
      opacity: spinning ? 0 : 1,
      transition: 'opacity 0.15s',
      color,
      pointerEvents: 'none',
    }),
  };

  const elSpinner = spinning && (
    <div {...styles.spinner}>
      <Spinner.Bar color={color} width={20} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      {elSpinner}
      <div {...styles.label}>{label}</div>
    </div>
  );
};

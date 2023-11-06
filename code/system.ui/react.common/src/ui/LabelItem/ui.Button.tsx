import { COLORS, Color, Spinner, css, useMouse, type t } from './common';

export type ButtonProps = {
  label?: string | JSX.Element;
  enabled?: boolean;
  selected?: boolean;
  focused?: boolean;
  spinning?: boolean;
  style?: t.CssValue;
};

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    spinning = false,
    label = 'Unnamed',
    enabled = true,
    selected = false,
    focused = false,
  } = props;
  const mouse = useMouse();

  /**
   * [Render]
   */
  const isBlue = selected && focused;
  let color = COLORS.DARK as string;
  if (isBlue) color = COLORS.WHITE;

  const borderAlpha = mouse.is.over && selected && enabled ? 0.8 : isBlue ? 0.4 : 0.2;

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
      visibility: spinning ? 'hidden' : 'visible',
      opacity: enabled ? 1 : isBlue ? 0.4 : 0.3,
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

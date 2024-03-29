import { COLORS, DEFAULTS, Spinner, css, type t } from './common';

export type ActionSpinnerProps = {
  action: t.LabelItemAction;
  selected?: boolean;
  focused?: boolean;
  style?: t.CssValue;
};

export const ActionSpinner: React.FC<ActionSpinnerProps> = (props) => {
  const { action, selected, focused } = props;
  if (!action.spinning) return null;

  /**
   * [Render]
   */
  const width = Wrangle.spinnerWidth(props);
  const color = selected && focused ? COLORS.WHITE : COLORS.DARK;
  const styles = {
    base: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      pointerEvents: 'none',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Spinner.Bar width={width} color={color} />
    </div>
  );
};

/**
 * [Helpers]
 */
const Wrangle = {
  spinnerWidth(props: ActionSpinnerProps) {
    const { action } = props;
    const width = {
      action: action.width,
      spinner: DEFAULTS.spinner.width,
    };

    if (typeof width.action === 'number') {
      if (width.action < width.spinner) return width.action;
    }

    return width.spinner;
  },
};

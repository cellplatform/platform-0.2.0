import { COLORS, Icons, Spinner, css, t } from '../common';

export type RunIconProps = {
  isSelected?: boolean;
  isOver?: boolean;
  isRunning?: boolean;
  style?: t.CssValue;
};

export const RunIcon: React.FC<RunIconProps> = (props) => {
  const { isSelected, isOver, isRunning } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    spinner: css({ Absolute: 0, display: 'grid', placeItems: 'center' }),
    icon: css({
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'top',
      opacity: Wrangle.spinnerOpacity(props),
      transition: `opacity 0.2s ease-in-out`,
      color: isOver && isSelected ? COLORS.BLUE : COLORS.DARK,
    }),
  };

  const elSpinner = isRunning && (
    <div {...styles.spinner}>
      <Spinner.Bar color={COLORS.GREEN} width={16} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <Icons.Run.FullCircle.Outline size={16} style={styles.icon} />
      {elSpinner}
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  spinnerOpacity(props: RunIconProps) {
    if (props.isRunning) return 0;
    return props.isSelected ? 0.8 : 0.25;
  },
};

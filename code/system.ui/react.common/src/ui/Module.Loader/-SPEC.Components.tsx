import { COLORS, Color, DEFAULTS, Spinner, css, type t } from './common';

export type SampleSpinnerProps = {
  theme?: t.ModuleLoaderTheme;
  style?: t.CssValue;
};

export const SampleSpinner: React.FC<SampleSpinnerProps> = (props) => {
  const { theme = DEFAULTS.theme } = props;
  const isDark = theme === 'Dark';

  /**
   * Render
   */
  const color = isDark ? COLORS.WHITE : COLORS.BLACK;
  const styles = {
    base: css({
      Size: 100,
      backgroundColor: isDark ? Color.alpha(COLORS.DARK, 0.8) : Color.alpha(COLORS.WHITE, 0.8),
      borderRadius: 10,
      display: 'grid',
      placeItems: 'center',
      backdropFilter: 'blur(10px)',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Spinner.Puff color={color} />
    </div>
  );
};

import { useEffect, useState } from 'react';
import { Button, COLORS, Color, DEFAULTS, Spinner, css, type t } from './common';

/**
 * Sample-Spinner
 */
export type SampleSpinnerProps = { theme?: t.ModuleLoaderTheme; style?: t.CssValue };
export const SampleSpinner: React.FC<SampleSpinnerProps> = (props) => {
  const { theme = DEFAULTS.theme } = props;
  const isDark = theme === 'Dark';
  const color = isDark ? COLORS.WHITE : COLORS.MAGENTA;
  const styles = {
    base: css({
      Size: 100,
      backgroundColor: isDark ? Color.alpha(COLORS.WHITE, 0.08) : Color.alpha(COLORS.MAGENTA, 0.03),
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

/**
 * Sample
 */
export type SampleProps = {
  text: string;
  theme: t.ModuleLoaderTheme;
  style?: t.CssValue;
};
export const Sample: React.FC<SampleProps> = (props) => {
  console.info(`💦 render: <Sample>`);
  const text = props.text ?? 'Sample';
  const [error, setError] = useState(false);

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (error) throw new Error(`Holy Syntax Error, Batman! → "${text}"`);
  }, [error]);

  /**
   * Render
   */
  const isDark = props.theme === 'Dark';
  const borderColor = isDark ? Color.alpha(COLORS.WHITE, 0.3) : Color.alpha(COLORS.MAGENTA, 0.2);
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      minHeight: 180,
    }),
    border: css({
      Absolute: 5,
      border: `dashed 1px ${borderColor}`,
      borderRadius: 6,
      pointerEvents: 'none',
    }),
    throwError: css({
      Absolute: [null, 12, 12, null],
      fontSize: 12,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>
        <div>{text}</div>
      </div>
      <div {...styles.border} />
      <Button.Blue label={'throw error'} onClick={() => setError(true)} style={styles.throwError} />
    </div>
  );
};

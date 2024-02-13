import { isValidElement } from 'react';
import { COLORS, DEFAULTS, Spinner, css, type t } from './common';
import { Wrangle } from './u.Wrangle';

export type LoadSpinnerProps = {
  theme?: t.ModuleLoaderTheme;
  spinning?: boolean;
  spinner?: t.ModuleLoaderSpinner;
  style?: t.CssValue;
};

export const LoadSpinner: React.FC<LoadSpinnerProps> = (props) => {
  const { spinning = DEFAULTS.spinning, theme = DEFAULTS.theme } = props;
  if (!spinning) return null;

  const spinner = Wrangle.spinner(props);

  /**
   * Render
   */
  const isDark = theme === 'Dark';
  const color = isDark ? COLORS.WHITE : COLORS.DARK;
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
    }),
  };

  let el: t.RenderOutput;
  if (typeof spinner.element === 'function') el = spinner.element({ theme });
  else if (isValidElement(spinner.element)) el = spinner.element;
  else el = <Spinner.Bar width={50} color={color} />;

  return <div {...css(styles.base, props.style)}>{el}</div>;
};

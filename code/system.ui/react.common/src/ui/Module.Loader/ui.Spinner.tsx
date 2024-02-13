import { isValidElement } from 'react';
import { COLORS, DEFAULTS, Spinner, css, type t } from './common';
import { Wrangle } from './u.Wrangle';

type RenderOutput = JSX.Element | null | false;

export type LoaderSpinnerProps = {
  theme?: t.ModuleLoaderTheme;
  spinning?: boolean;
  spinner?: t.ModuleLoaderSpinner;
  style?: t.CssValue;
};

export const LoaderSpinner: React.FC<LoaderSpinnerProps> = (props) => {
  const { spinning = DEFAULTS.spinning, theme = DEFAULTS.theme } = props;
  const spinner = Wrangle.spinner(props);
  const isDark = theme === 'Dark';

  if (!spinning) return null;

  /**
   * Render
   */
  const color = isDark ? COLORS.WHITE : COLORS.DARK;
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
    }),
  };

  let el: RenderOutput;
  if (typeof spinner.element === 'function') el = spinner.element({ theme });
  else if (isValidElement(spinner.element)) el = spinner.element;
  else el = <Spinner.Bar width={50} color={color} />;

  return <div {...css(styles.base, props.style)}>{el}</div>;
};

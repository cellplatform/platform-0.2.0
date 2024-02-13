import { css, type t } from './common';
import { Wrangle } from './u.Wrangle';
import { LoaderSpinner } from './ui.Spinner';

export type BodyProps = {
  theme?: t.ModuleLoaderTheme;
  element?: JSX.Element | null | false;
  spinning?: boolean;
  spinner?: t.ModuleLoaderSpinner;
  style?: t.CssValue;
};

export const Body: React.FC<BodyProps> = (props) => {
  const { spinning, element } = props;
  if (!(spinning || element)) return null;

  /**
   * Render
   */
  const spinner = Wrangle.spinner(props);
  const styles = {
    base: css({ position: 'relative' }),
    spinner: css({ Absolute: 0 }),
    content: css({
      Absolute: 0,
      opacity: spinning ? spinner.bodyOpacity ?? 0 : 1,
      filter: `blur(${spinning ? spinner?.bodyBlur ?? 0 : 0}px)`,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.content}>{element}</div>
      <LoaderSpinner
        spinning={spinning}
        spinner={props.spinner}
        theme={props.theme}
        style={styles.spinner}
      />
    </div>
  );
};

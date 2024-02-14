import { ErrorBoundary, css, type t } from './common';
import { Wrangle } from './u.Wrangle';
import { ErrorFallback, type ErrorFallbackProps } from './ui.ErrorFallback';
import { LoadSpinner } from './ui.Spinner';

export type BodyProps = {
  theme?: t.ModuleLoaderTheme;
  element?: JSX.Element | null | false;
  spinning?: boolean;
  spinner?: t.ModuleLoaderSpinner;
  style?: t.CssValue;
  onError?: t.ModuleLoaderErrorHandler;
  onErrorCleared?: t.ModuleLoaderErrorClearedHandler;
};

export const Body: React.FC<BodyProps> = (props) => {
  const { spinning, element } = props;
  if (!(spinning || element)) return null;

  /**
   * Handers
   */
  const errorFallback = (args: ErrorFallbackProps) => {
    const { onError, onErrorCleared } = props;
    return <ErrorFallback {...args} onError={onError} onErrorCleared={onErrorCleared} />;
  };

  /**
   * Render
   */
  const spinner = Wrangle.spinner(props);
  const styles = {
    base: css({ position: 'relative', display: 'grid' }),
    spinner: css({ Absolute: 0 }),
    content: css({
      opacity: spinning ? spinner.bodyOpacity ?? 0 : 1,
      filter: `blur(${spinning ? spinner?.bodyBlur ?? 0 : 0}px)`,
      display: 'grid',
    }),
  };

  const elContent = (
    <div {...styles.content}>
      <ErrorBoundary fallbackRender={errorFallback}>{element}</ErrorBoundary>
    </div>
  );

  const elSpinner = (
    <LoadSpinner
      spinning={spinning}
      spinner={props.spinner}
      theme={props.theme}
      style={styles.spinner}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elContent}
      {elSpinner}
    </div>
  );
};

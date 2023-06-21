import { DEFAULTS, Spinner, css, type t } from './common';

export type LoadingProps = {
  style?: t.CssValue;
};

export const Loading: React.FC<LoadingProps> = (props) => {
  const styles = {
    base: css({
      ...DEFAULTS.minSize,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const MAX = 100;
  const spinnerWidth = Math.min(DEFAULTS.minSize.minWidth - 60, MAX);

  return (
    <div {...css(styles.base, props.style)}>
      <Spinner.Bar width={spinnerWidth} />
    </div>
  );
};

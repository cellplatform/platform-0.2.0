import { COLORS, Color, Spinner, css, type t } from './common';

export type LoadingProps = {
  style?: t.CssValue;
};

export const Loading: React.FC<LoadingProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      minHeight: 32,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Spinner.Bar color={Color.alpha(COLORS.DARK, 0.5)} />
    </div>
  );
};

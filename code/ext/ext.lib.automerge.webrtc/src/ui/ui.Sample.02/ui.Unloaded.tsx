import { COLORS, Color, css, type t } from './common';

export type UnloadedProps = {
  style?: t.CssValue;
};

export const Unloaded: React.FC<UnloadedProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 6,
      border: `solid 1px ${Color.alpha(COLORS.MAGENTA, 0.1)}`,
      borderRadius: 6,
      fontSize: 12,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷 unloaded`}</div>
    </div>
  );
};

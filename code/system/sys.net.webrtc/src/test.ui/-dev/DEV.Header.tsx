import { Color, COLORS, css, Icons, t } from '../common';

export type DevHeaderProps = {
  style?: t.CssValue;
};

export const DevHeader: React.FC<DevHeaderProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      padding: 30,
    }),
    screen: css({
      backgroundColor: Color.alpha(COLORS.DARK, 0.03),
      height: 200,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      borderRadius: 12,

      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.screen}>
        <Icons.Cube size={80} color={Color.alpha(COLORS.DARK, 0.1)} />
      </div>
    </div>
  );
};

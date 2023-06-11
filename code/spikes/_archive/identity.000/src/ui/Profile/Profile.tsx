import { Color, COLORS, css, t } from '../common';
import { Details } from './Profile.Details';
import { Image } from './Profile.Image';
import { Wrangle } from './Wrangle.mjs';

export type RootProps = {
  style?: t.CssValue;
};

export const Root: React.FC<RootProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: COLORS.WHITE,
      color: COLORS.DARK,
      fontFamily: 'sans-serif',
      overflow: 'hidden',
    }),
    body: css({
      Absolute: 0,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      backgroundColor: Color.alpha(COLORS.DARK, 0.03),
    }),
    columns: css({
      display: 'grid',
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundColor: COLORS.WHITE,
      Padding: [55, 50, 55, 50],
      borderRadius: 20,
      border: `solid 1px ${Color.format(-0.06)}`,
    }),
    details: css({
      boxSizing: 'border-box',
      marginTop: 20,
    }),
  };

  const elAvatar = <Image width={360} />;

  const elDetails = (
    <div {...styles.details}>
      <Details />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.columns}>
          {elAvatar}
          {elDetails}
        </div>
      </div>
    </div>
  );
};

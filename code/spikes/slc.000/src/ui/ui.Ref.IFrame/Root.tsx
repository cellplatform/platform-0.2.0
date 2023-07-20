import { COLORS, IFrame, css, type t } from '../common';

export type RootProps = {
  src?: string;
  title?: string;
  style?: t.CssValue;
};

export const RefIFrame: React.FC<RootProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: COLORS.WHITE,
      width: '100%',
      height: '100%',
      border: 'none',
    }),
  };

  return <IFrame src={props.src} style={css(styles.base, props.style)} />;
};

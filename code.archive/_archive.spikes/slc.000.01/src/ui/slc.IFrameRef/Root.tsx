import { COLORS, IFrame, css, type t } from '../common';

export type IFrameRefProps = {
  src?: string;
  title?: string;
  style?: t.CssValue;
};

export const IFrameRef: React.FC<IFrameRefProps> = (props) => {
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

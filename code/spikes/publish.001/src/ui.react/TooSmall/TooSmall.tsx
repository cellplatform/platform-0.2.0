import { Color, css, t } from '../common';

type Pixels = number;
type Color = string | number;

export type TooSmallProps = {
  backdropBlur?: Pixels;
  backgroundColor?: Color;
  style?: t.CssValue;
};

export const TooSmall: React.FC<TooSmallProps> = (props) => {
  const { backdropBlur = 18, backgroundColor = 0.3 } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      Flex: 'center-center',
      backgroundColor: Color.format(backgroundColor),
      backdropFilter: `blur(${backdropBlur}px)`,
      userSelect: 'none',
    }),
    body: css({
      Flex: 'y-center-center',
      Padding: [0, 30],
    }),
    title: css({
      fontSize: 38,
      marginBottom: 5,
      '@media (max-width: 391px)': { marginBottom: 20 },
    }),
    detail: css({
      fontSize: 18,
      lineHeight: '1.4em',
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div {...styles.title}>{'Screen too small.'}</div>
        <div {...styles.detail}>{'Please expand or view on your laptop/desktop.'}</div>
      </div>
    </div>
  );
};

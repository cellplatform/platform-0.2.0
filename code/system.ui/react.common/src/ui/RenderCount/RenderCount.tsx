import { useRef } from 'react';
import { COLORS, css, t } from '../common';

type N = number | null;

export type RenderCountProps = {
  absolute?: [N, N, N, N];
  style?: t.CssValue;
};

export const RenderCount: React.FC<RenderCountProps> = (props) => {
  const countRef = useRef(0);

  countRef.current++;
  const text = `render-${countRef.current}`;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: props.absolute ?? [3, 4, null, null],
      pointerEvents: 'none',
      color: COLORS.DARK,
      fontSize: 11,
      opacity: 0.6,
    }),
  };

  return <div {...css(styles.base, props.style)}>{text}</div>;
};

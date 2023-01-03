import { useRef } from 'react';
import { COLORS, css, t } from '../common';

type N = number | null;

export type RenderCountProps = {
  absolute?: [N, N] | [N, N, N, N];
  prefix?: string;
  style?: t.CssValue;
};

export const RenderCount: React.FC<RenderCountProps> = (props) => {
  const { prefix = 'render-' } = props;
  const countRef = useRef(0);
  countRef.current++;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: Wrangle.absolute(props.absolute),
      pointerEvents: 'none',
      color: COLORS.DARK,
      fontSize: 11,
      opacity: 0.6,
    }),
  };

  const text = `${prefix}${countRef.current}`;
  return <div {...css(styles.base, props.style)}>{text}</div>;
};

/**
 * [Helpers]
 */

const Wrangle = {
  absolute(input: RenderCountProps['absolute']) {
    if (!input || !Array.isArray(input)) return [3, 4, null, null];
    if (input.length === 2) return [input[0], input[1], null, null];
    return input.slice(0, 3);
  },
};

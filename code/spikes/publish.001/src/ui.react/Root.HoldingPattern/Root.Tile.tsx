import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common';

export type RootTitleProps = {
  children?: JSX.Element;
  style?: t.CssValue;
};

export const RootTitle: React.FC<RootTitleProps> = (props) => {
  const [isOver, setOver] = useState(false);
  const over = (isOver: boolean) => () => setOver(isOver);

  /**
   * [Render]
   */
  const boxShadow = (isOver: boolean) => {
    const color = Color.alpha(COLORS.DARK, isOver ? 0.07 : 0);
    return `0 0px 50px 0 ${color}`;
  };

  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      Padding: [30, 95],
      paddingBottom: 20,
    }),
    over: css({
      // border: `solid 1px `,
      // borderRadius: 15,
      // boxShadow: boxShadow(isOver),
      // borderColor: `${Color.alpha(COLORS.DARK, isOver ? 0.3 : 0)}`,
      // backgroundColor: Color.format(isOver ? 0 : 1),
    }),
    body: css({}),
  };

  return (
    <div
      {...css(styles.base, styles.over, props.style)}
      onMouseEnter={over(true)}
      onMouseLeave={over(false)}
    >
      <div {...styles.body}>{props.children}</div>
    </div>
  );
};

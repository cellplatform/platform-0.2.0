import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type BodyProps = {
  style?: t.CssValue;
};

export const Body: React.FC<BodyProps> = (props) => {
  const CYAN = COLORS.CYAN;

  /**
   * [Render]
   */
  const EDGE_BORDER = `solid 1px ${Color.alpha(CYAN, 0.3)}`;
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.alpha(CYAN, 0.06),
      minHeight: 90,
      borderTop: EDGE_BORDER,
      borderBottom: EDGE_BORDER,
    }),
    empty: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      fontStyle: 'italic',
      fontSize: 14,
      color: Color.alpha(CYAN, 0.7),
    }),
  };

  const elEmpty = <div {...styles.empty}>{`Nothing to display`}</div>;

  return <div {...css(styles.base, props.style)}>{elEmpty}</div>;
};

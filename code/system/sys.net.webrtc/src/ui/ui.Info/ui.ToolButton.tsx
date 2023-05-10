import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from './common';

export type ToolButtonProps = {
  children?: JSX.Element;
  style?: t.CssValue;
};

export const ToolButton: React.FC<ToolButtonProps> = (props) => {
  /**
   * [Render]
   */
  const PADDING = 5;
  const styles = {
    base: css({
      display: 'grid',
      placeItems: 'center',
      paddingLeft: PADDING,
      paddingRight: PADDING,
    }),
  };

  return <div {...css(styles.base, props.style)}>{props.children}</div>;
};

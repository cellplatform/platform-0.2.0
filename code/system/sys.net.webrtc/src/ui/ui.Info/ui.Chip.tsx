import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type ChipProps = {
  text: string;
  style?: t.CssValue;
};

export const Chip: React.FC<ChipProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      fontFamily: 'monospace',
      fontWeight: 600,
      fontSize: 10,
      color: Color.alpha(COLORS.DARK, 0.8),
      borderRadius: 3,
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      backgroundColor: Color.alpha(COLORS.DARK, 0.08),
      boxSizing: 'border-box',
      PaddingX: 2,
    }),
    label: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.label}>{props.text}</div>
    </div>
  );
};

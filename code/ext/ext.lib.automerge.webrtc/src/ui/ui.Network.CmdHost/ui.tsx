import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export const View: React.FC<t.NetworkCmdhost> = (props) => {
  const { theme } = props;

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({
      color,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
    </div>
  );
};

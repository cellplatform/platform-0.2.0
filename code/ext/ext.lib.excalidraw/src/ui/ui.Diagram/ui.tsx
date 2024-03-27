import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';
import { Excalidraw } from '@excalidraw/excalidraw';

export const View: React.FC<t.DiagramProps> = (props) => {
  // const theme

  /**
   * Render
   */
  const color = Color.fromTheme(props.theme);
  const styles = {
    base: css({ color, display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Excalidraw theme={wrangle.lowercaseTheme(props.theme)} />
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  lowercaseTheme(theme?: t.CommonTheme) {
    return theme === 'Light' ? 'light' : 'dark';
  },
} as const;

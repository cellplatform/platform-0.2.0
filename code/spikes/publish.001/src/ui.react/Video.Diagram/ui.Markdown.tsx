import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';

export type VideoDiagramMarkdownProps = {
  dimmed?: boolean;
  style?: t.CssValue;
};

export const VideoDiagramMarkdown: React.FC<VideoDiagramMarkdownProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      position: 'relative',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>VideoDiagramMarkdown 🐷</div>
    </div>
  );
};

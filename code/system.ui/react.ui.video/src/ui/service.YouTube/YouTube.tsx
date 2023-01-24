import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, IFrame } from '../common';

export type YouTubeProps = {
  style?: t.CssValue;
};

export const YouTube: React.FC<YouTubeProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  {
    /* <iframe 
    width="560" \
    height="315" 
    src="https://www.youtube.com/embed/URUJD5NEXC8" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen>
    </iframe> */
  }

  return (
    <div {...css(styles.base, props.style)}>
      <div>{`YouTube 🐷`}</div>
    </div>
  );
};

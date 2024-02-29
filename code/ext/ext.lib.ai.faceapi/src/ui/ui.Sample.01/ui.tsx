import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type SampleProps = {
  media?: MediaStream;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const { media } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (media && videoRef.current) videoRef.current.srcObject = media;
  }, [media]);

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid' }),
    video: css({ width: '100%', height: '100%', objectFit: 'cover' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <video ref={videoRef} muted={true} autoPlay={true} {...styles.video} />
    </div>
  );
};

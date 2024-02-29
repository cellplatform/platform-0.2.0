import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from './common';

export type SampleProps = {
  stream?: MediaStream;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const { stream } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const video = videoRef.current;
    if (stream && video) video.srcObject = stream;
  }, [stream]);

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

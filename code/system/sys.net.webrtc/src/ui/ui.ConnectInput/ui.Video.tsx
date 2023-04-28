import { useEffect, useRef, useState } from 'react';
import { MediaStream, Color, COLORS, css, t, rx } from './common';

export type VideoProps = {
  size?: number;
  stream?: MediaStream;
  style?: t.CssValue;
};

export const Video: React.FC<VideoProps> = (props) => {
  const { stream, size = 64 } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Size: size,
      borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {stream && (
        <MediaStream.Video stream={props.stream} width={size} height={size} muted={true} />
      )}
    </div>
  );
};

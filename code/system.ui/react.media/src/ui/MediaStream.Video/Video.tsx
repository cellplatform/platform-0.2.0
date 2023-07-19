import { useEffect, useRef } from 'react';
import { Color, Style, css, type t } from '../common';

export const Video: React.FC<t.VideoProps> = (props) => {
  const { stream, muted = true, width, height, borderRadius } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream, videoRef]);

  const styles = {
    base: css({
      position: 'relative',
      overflow: 'hidden',
      borderRadius: Style.toRadius(borderRadius),
      backgroundColor: Color.format(props.backgroundColor),
      width,
      height,
    }),
    video: css({
      display: stream?.active ? 'block' : 'none',
      objectFit: 'cover',
      width: '100%',
      height: '100%',
    }),
  };

  return (
    <div
      {...css(styles.base, props.style)}
      title={props.tooltip}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <video
        {...styles.video}
        ref={videoRef}
        autoPlay={true}
        muted={muted}
        onLoadedData={props.onLoadedData}
      />
    </div>
  );
};

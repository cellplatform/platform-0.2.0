import { useEffect, useRef } from 'react';
import { css, t, Style, Color } from './common';

type ClickHandler = React.MouseEventHandler<HTMLDivElement>;

export type VideoProps = {
  stream?: MediaStream;
  width?: number;
  height?: number;
  borderRadius?: t.CssRadiusInput;
  backgroundColor?: string | number;
  muted?: boolean;
  style?: t.CssValue;
  onClick?: ClickHandler;
  onMouseDown?: ClickHandler;
  onMouseUp?: ClickHandler;
  onMouseEnter?: ClickHandler;
  onMouseLeave?: ClickHandler;
};

export const Video: React.FC<VideoProps> = (props) => {
  const { stream, muted: isMuted = false, width, height, borderRadius } = props;
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
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <video {...styles.video} ref={videoRef} autoPlay={true} muted={isMuted} />
    </div>
  );
};

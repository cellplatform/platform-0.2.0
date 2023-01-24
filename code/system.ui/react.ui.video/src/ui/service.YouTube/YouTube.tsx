import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, IFrame } from '../common';

type Seconds = number;

export type YouTubeProps = {
  id?: string;
  start?: Seconds;
  width?: number;
  height?: number;
  allowFullScreen?: boolean;
  style?: t.CssValue;
};

export const YouTube: React.FC<YouTubeProps> = (props) => {
  const url = Wrangle.src(props);
  const allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

  if (!url) return null;

  return (
    <IFrame
      title={'YouTube'}
      style={props.style}
      width={props.width}
      height={props.height}
      src={url}
      allow={allow}
      allowFullScreen={props.allowFullScreen}
    />
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  src(props: YouTubeProps) {
    const { id, start } = props;
    if (!id) return undefined;
    const url = `https://www.youtube.com/embed/${id.trim()}`;
    return typeof start === 'number' ? `${url}?start=${start}` : url;
  },
};

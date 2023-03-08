import { IFrame, t, FC } from '../common';
import { usePlayerApi } from './usePlayerApi.mjs';
import { Wrangle } from './util.mjs';
import { DEFAULTS } from './const.mjs';

type Seconds = number;

export type YouTubeProps = {
  id?: string;
  start?: Seconds;
  width?: number | string;
  height?: number | string;
  allowFullScreen?: boolean;
  style?: t.CssValue;
};

const View: React.FC<YouTubeProps> = (props) => {
  const url = Wrangle.toEmbedUrl(props);
  const allow = DEFAULTS.allow;

  const player = usePlayerApi();

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
 * Export
 */
type Fields = {
  Wrangle: typeof Wrangle;
  DEFAULTS: typeof DEFAULTS;
};
export const YouTube = FC.decorate<YouTubeProps, Fields>(
  View,
  { Wrangle, DEFAULTS },
  { displayName: 'YouTube' },
);

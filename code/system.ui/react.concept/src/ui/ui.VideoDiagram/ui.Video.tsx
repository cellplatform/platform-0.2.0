import { EdgePosition, type t } from './common';
import { VideoPlayer } from './ui.Video.Player';

export type VideoProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlug;
  style?: t.CssValue;
};

export const VideoLayout: React.FC<VideoProps> = (props) => {
  const { slug, vimeo } = props;
  const video = slug?.video;
  const hasVideo = Boolean(video?.id && vimeo);
  const elVideo = hasVideo && <VideoPlayer slug={video} vimeo={vimeo} />;
  return (
    <EdgePosition position={video?.position} style={props.style}>
      {elVideo}
    </EdgePosition>
  );
};

import { Position, type t } from './common';
import { VideoPlayer } from './ui.Video.Player';

export type VideoProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlugVideo;
  style?: t.CssValue;
};

export const VideoLayout: React.FC<VideoProps> = (props) => {
  const { slug = {}, vimeo } = props;
  const hasVideo = Boolean(slug.id && vimeo);
  return (
    <Position position={slug.position} style={props.style}>
      {hasVideo && <VideoPlayer slug={slug} vimeo={vimeo} />}
    </Position>
  );
};

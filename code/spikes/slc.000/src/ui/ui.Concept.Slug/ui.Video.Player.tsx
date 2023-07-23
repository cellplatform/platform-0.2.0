import { Vimeo, css, type t } from './common';

export type VideoPlayerProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlugVideo;
  style?: t.CssValue;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const { slug = {}, vimeo } = props;
  if (!(slug.id && vimeo)) return null;

  /**
   * [Render]
   */
  const height = slug.height ?? 200;
  const isScaled = typeof slug.scale === 'number';
  const styles = {
    base: css({ overflow: 'hidden', borderRadius: 5 }),
    inner: css({
      transform: isScaled ? `scale(${slug.scale})` : undefined, // NB: transform → scale/zoom.
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.inner}>
        <Vimeo.Player instance={vimeo} video={slug.id} borderRadius={10} height={height} />
      </div>
    </div>
  );
};

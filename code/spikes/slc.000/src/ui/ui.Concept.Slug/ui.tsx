import { css, type t } from './common';
import { ImageLayout } from './ui.Image.Layout';
import { VideoLayout } from './ui.Video.Layout';

export const View: React.FC<t.ConceptSlugProps> = (props) => {
  const { slug, vimeo } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    video: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ImageLayout slug={slug} />
      <VideoLayout slug={slug} vimeo={vimeo} style={styles.video} />
    </div>
  );
};

import { css, type t, usePlayer } from './common';
import { ImageLayout } from './ui.Image';
import { VideoLayout } from './ui.Video';

export const View: React.FC<t.ConceptSlugProps> = (props) => {
  const { slug, vimeo } = props;
  const player = usePlayer(vimeo);

  /**
   * Handlers
   */
  const handleClick = () => player.toggle();

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    fill: css({ Absolute: 0 }),
    mask: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)} onClick={handleClick}>
      <ImageLayout slug={slug} style={styles.fill} />
      <VideoLayout slug={slug} vimeo={vimeo} style={styles.fill} />
      <div {...styles.mask} onClick={handleClick} />
    </div>
  );
};

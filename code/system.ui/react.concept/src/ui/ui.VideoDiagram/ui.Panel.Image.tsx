import { Wrangle } from './Wrangle';
import { DEFAULTS, Image, css, type t } from './common';

export type ImagePanelProps = {
  video?: t.SlugVideo;
  status?: t.VideoStatus;
  style?: t.CssValue;
};

export const ImagePanel: React.FC<ImagePanelProps> = (props) => {
  const { video = {}, status } = props;
  const timestamps = video.timestamps;
  const seconds = status?.secs.current;
  const image = Wrangle.imageAtTime(timestamps, seconds);
  if (!image) return;

  const defaults = DEFAULTS.image;
  const sizing = image.sizing ?? defaults.sizing;
  const scale = image.scale ?? DEFAULTS.image.scale;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      overflow: 'hidden',
      paddingBottom: 1, // NB: prevent debug border from obscuring the focus outline.
    }),
    image: css({ transform: `scale(${scale})` }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Image
        style={styles.image}
        src={image.src}
        sizing={sizing}
        drop={{ enabled: false }}
        paste={{ enabled: false }}
      />
    </div>
  );
};

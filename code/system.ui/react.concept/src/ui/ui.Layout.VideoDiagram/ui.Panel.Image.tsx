import { DEFAULTS, Image, css, type t } from './common';

export type ImagePanelProps = {
  image?: t.VideoDiagramImage;
  style?: t.CssValue;
};

export const ImagePanel: React.FC<ImagePanelProps> = (props) => {
  const { image = {} } = props;
  if (!image.src) return null;

  const defaults = DEFAULTS.image;
  const sizing = image.sizing ?? defaults.sizing;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      overflow: 'hidden',
      paddingBottom: 1, // NB: prevent debug border from obscuring the focus outline.
    }),
    image: css({
      transform: `scale(${image.scale ?? DEFAULTS.image.scale})`,
    }),
  };

  /**
   * TODO 🐷
   * - pass image props down
   * - fire image events up
   */

  return (
    <div {...css(styles.base, props.style)}>
      <Image src={image.src} sizing={sizing} style={styles.image} />
    </div>
  );
};

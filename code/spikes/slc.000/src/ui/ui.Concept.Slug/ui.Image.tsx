import { DEFAULTS, Image, css, type t } from './common';

export type ImageLayoutProps = {
  slug?: t.ConceptSlug;
  style?: t.CssValue;
};

export const ImageLayout: React.FC<ImageLayoutProps> = (props) => {
  const { slug } = props;
  const src = slug?.image?.src;
  const sizing = slug?.image?.sizing ?? DEFAULTS.imageSizing;

  /**
   * [Render]
   */
  const styles = {
    base: css({ display: 'grid' }),
    image: css({
      /**
       * TODO 🐷 Temp HACK!
       * - do some better form of image positioning and
       *   layout so as not to bang into the <Video>.
       */
      MarginX: 20,
      marginTop: 20,
      marginBottom: slug?.video?.height ?? DEFAULTS.videoHeight,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Image src={src} sizing={sizing} style={styles.image} />
    </div>
  );
};

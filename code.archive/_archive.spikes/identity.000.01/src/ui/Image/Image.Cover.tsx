import { css, t } from '../common';

export type ImageCoverProps = {
  url: string;
  style?: t.CssValue;
};

export const ImageCover: React.FC<ImageCoverProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundImage: `url(${props.url})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
    }),
  };
  return <div {...css(styles.base, props.style)} />;
};

import { css, t } from '../common';
import { Wrangle } from './Wrangle.mjs';

export type ImageProps = {
  width?: number;
  style?: t.CssValue;
};

export const Image: React.FC<ImageProps> = (props) => {
  const { width } = props;
  const media = Wrangle.mediaFromUrl(location.href);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    logo: css({
      width,
      borderRadius: 25,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <img src={media.image} {...styles.logo} />
    </div>
  );
};

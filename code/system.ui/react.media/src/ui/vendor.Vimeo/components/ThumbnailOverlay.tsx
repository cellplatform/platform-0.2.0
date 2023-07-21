import { css, type t } from '../common.mjs';

export type ThumbnailOverlayProps = {
  href?: string;
  isPlaying?: boolean;
  style?: t.CssValue;
};

export const ThumbnailOverlay: React.FC<ThumbnailOverlayProps> = (props) => {
  const { href, isPlaying = false } = props;

  const styles = {
    base: css({
      Absolute: 0,
      pointerEvents: 'none',
      opacity: href && !isPlaying ? 1 : 0,
      transition: `opacity 200ms ease`,
    }),
    image: css({
      Absolute: 0,
      backgroundImage: `url(${href})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.image}></div>
    </div>
  );
};

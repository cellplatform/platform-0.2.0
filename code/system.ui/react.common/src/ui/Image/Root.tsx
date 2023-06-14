import { DEFAULTS, FC, css, type t } from './common';
import { useBinaryImage } from './hooks/useBinaryImage.mjs';
import { useDrop } from './hooks/useDrop.mjs';
import { Drop } from './ui/Drop';

export type { ImageProps } from './types.mjs';

const View: React.FC<t.ImageProps> = (props) => {
  const { src } = props;

  const binary = useBinaryImage(typeof src === 'object' ? src : undefined);
  const drag = useDrop(props);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
    }),
    image: css({
      Absolute: 0,
      backgroundImage: binary.url ? `url(${binary.url})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  };

  const elDragOver = drag.is.over && <Drop settings={props.drop} />;
  const elImg = binary.url && <div {...styles.image} />;

  return (
    <div ref={drag.ref} {...css(styles.base, props.style)}>
      {elImg}
      {elDragOver}
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Image = FC.decorate<t.ImageProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Image' },
);

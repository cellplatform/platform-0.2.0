import { DEFAULTS, FC, css, useDragTarget, type t } from './common';
import { useBinaryImage } from './useBinaryImage.mjs';
export type { ImageProps } from './types.mjs';

const View: React.FC<t.ImageProps> = (props) => {
  const { src } = props;
  const binary = useBinaryImage(typeof src === 'object' ? src : undefined);

  /**
   * Drag/drop
   */
  const drag = useDragTarget((e) => {
    const file = e.files.find((item) => DEFAULTS.supportedMimeTypes.includes(item.mimetype));
    if (file) props.onDrop?.({ file });
  });

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
    }),
    dragOver: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      backdropFilter: `blur(${Wrangle.backdropBlur(props)}px)`,
      pointerEvents: 'none',
    }),
    image: css({
      Absolute: 0,
      backgroundImage: binary.url ? `url(${binary.url})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  };

  const elDragOver = drag.isDragOver && <div {...styles.dragOver}>Drop Image</div>;
  const elImg = binary.url && <div {...styles.image} />;

  return (
    <div ref={drag.ref} {...css(styles.base, props.style)}>
      {elImg}
      {elDragOver}
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  backdropBlur(props: t.ImageProps) {
    return props.dragOver?.blur ?? DEFAULTS.dragOver.blur;
  },
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

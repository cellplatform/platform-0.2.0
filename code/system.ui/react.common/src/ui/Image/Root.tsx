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
      backdropFilter: `blur(${Wrangle.dropOverBlur(props)}px)`,
      pointerEvents: 'none',
    }),
    image: css({
      Absolute: 0,
      backgroundImage: binary.url ? `url(${binary.url})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  };

  const elDragOver = drag.isDragOver && (
    <div {...styles.dragOver}>{Wrangle.dropOverContent(props)}</div>
  );
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
  dropOverBlur(props: t.ImageProps) {
    return props.drop?.overBlur ?? DEFAULTS.drop.overBlur;
  },

  dropOverContent(props: t.ImageProps) {
    return props.drop?.overContent ?? DEFAULTS.drop.overContent;
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

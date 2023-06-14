import { DEFAULTS, FC, css, useDragTarget, type t } from './common';
import { useBinaryImage } from './useBinaryImage.mjs';

export type ImageDropHandler = (e: ImageDropHandlerArgs) => void;
export type ImageDropHandlerArgs = { file: t.DroppedFile };

export type ImageProps = {
  src?: string | t.ImageBinary;
  style?: t.CssValue;
  onDrop?: ImageDropHandler;
};

const View: React.FC<ImageProps> = (props) => {
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
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    dragOver: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      backdropFilter: 'blur(5px)',
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
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Image = FC.decorate<ImageProps, Fields>(View, { DEFAULTS }, { displayName: 'Image' });

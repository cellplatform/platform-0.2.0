import { useRef } from 'react';

import { DEFAULTS, FC, css, type t } from './common';
import { useBinaryImage } from './hooks/useBinaryImage.mjs';
import { useDrop } from './hooks/useDrop.mjs';
import { usePaste } from './hooks/usePaste.mjs';
import { Overlay } from './ui/Overlay';
import { Util } from './Util.mjs';
import { DropOverlay } from './ui/Drop';
import { PasteOverlay } from './ui/Paste';

export type { ImageProps } from './types.mjs';

const View: React.FC<t.ImageProps> = (props) => {
  const { src } = props;

  const ref = useRef<HTMLDivElement>(null);
  const binary = useBinaryImage(typeof src === 'object' ? src : undefined);
  const drag = useDrop(ref, props);
  const paste = usePaste(ref, props);

  // console.log('focus', focus.containsFocus);
  // console.log('paste', paste.is, paste.tabIndex);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', outline: 'none' }),
    image: css({
      Absolute: 0,
      backgroundImage: binary.url ? `url(${binary.url})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  };

  const elDragOverlay = drag.is.over && (
    // <Overlay blur={Util.dropOverBlur(props.drop)} message={Util.dropOverContent(props.drop)} />
    <DropOverlay settings={props.drop} />
  );

  const elPasteOverlay = !elDragOverlay && paste.is.focused && (
    // <Overlay blur={Util.focusedBlur(props.paste)} message={Util.focusedContent(props.paste)} />
    <PasteOverlay settings={props.paste} />
  );

  const elImg = binary.url && <div {...styles.image} />;

  return (
    <div ref={ref} {...css(styles.base, props.style)} tabIndex={paste.tabIndex}>
      {elImg}
      {elDragOverlay}
      {elPasteOverlay}
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

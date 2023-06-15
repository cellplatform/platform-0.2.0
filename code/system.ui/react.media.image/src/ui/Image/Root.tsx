import { useRef } from 'react';

import { DEFAULTS, FC, css, type t } from './common';
import { useBinaryImage } from './hooks/useBinaryImage.mjs';
import { useDrop } from './hooks/useDrop.mjs';
import { usePaste } from './hooks/usePaste.mjs';
import { useWarning } from './hooks/useWarning.mjs';
import { DropOverlay } from './ui/Drop';
import { PasteOverlay } from './ui/Paste';
import { WarnOverlay } from './ui/Warn';

export type { ImageProps } from './types.mjs';

const View: React.FC<t.ImageProps> = (props) => {
  const { src } = props;

  const message = useWarning(props);
  const warn = message.write;

  const ref = useRef<HTMLDivElement>(null);
  const drag = useDrop(ref, props, { warn });
  const paste = usePaste(ref, props, { warn });
  const binary = useBinaryImage(typeof src === 'object' ? src : undefined);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', outline: 'none' }),
    image: css({
      Absolute: 0,
      backgroundImage: binary.url ? `url(${binary.url})` : undefined,
      backgroundPosition: 'center',
      backgroundSize: props.sizing ?? DEFAULTS.sizing,
      backgroundRepeat: 'no-repeat',
    }),
  };

  const elDrag = drag.is.over && <DropOverlay settings={props.drop} />;

  const showWarning = message.content && !elDrag;
  const elWarning = showWarning && (
    <WarnOverlay settings={props.warning} message={message.content} />
  );

  const showPaste = paste.is.focused && !elDrag && !elWarning;
  const elPaste = showPaste && <PasteOverlay settings={props.paste} />;

  const elImg = binary.url && <div {...styles.image} />;

  return (
    <div ref={ref} {...css(styles.base, props.style)} tabIndex={paste.tabIndex}>
      {elImg}
      {elDrag}
      {elPaste}
      {elWarning}
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

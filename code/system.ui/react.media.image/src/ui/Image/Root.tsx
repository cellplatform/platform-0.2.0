import { useRef } from 'react';

import { DEFAULTS, FC, css, type t, Color } from './common';
import { useBinaryImage } from './hooks/useBinaryImage';
import { useDrop } from './hooks/useDrop';
import { usePaste } from './hooks/usePaste';
import { useWarning } from './hooks/useWarning';
import { DropOverlay } from './ui/Drop';
import { Focused } from './ui/Focused';
import { Warning } from './ui/Warning';

const View: React.FC<t.ImageProps> = (props) => {
  const { src, debug = false } = props;

  const debugColor = Color.debug(props.debug);

  const warning = useWarning(props);
  const warn = warning.write;

  const ref = useRef<HTMLDivElement>(null);
  const drag = useDrop(ref, props, { warn });
  const paste = usePaste(ref, props, { warn });
  const binary = useBinaryImage(typeof src === 'object' ? src : undefined);

  let backgroundImage = '';
  if (binary.url) backgroundImage = `url(${binary.url})`;
  if (!binary.url && src) backgroundImage = `url(${src})`;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      outline: 'none',
    }),
    debug: css({
      Absolute: 0,
      backgroundColor: debugColor(0.05),
      border: `dashed 1px ${debugColor(0.15)}`,
      pointerEvents: 'none',
    }),
    image: css({
      Absolute: 0,
      backgroundImage,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: props.sizing ?? DEFAULTS.sizing,
    }),
  };

  const elFocused = paste.is.focused && <Focused />;
  const elDrag = drag.is.over && <DropOverlay settings={props.drop} />;
  const elWarn = warning.content && !elDrag && (
    <Warning settings={props.warning} message={warning.content} />
  );
  const elImage = backgroundImage && <div {...styles.image} />;
  const elDebug = debug && <div {...styles.debug} />;

  return (
    <div
      ref={ref}
      {...css(styles.base, props.style)}
      tabIndex={paste.tabIndex}
      className={'sys-Image'}
    >
      {elImage}
      {elDrag}
      {elFocused}
      {elWarn}
      {elDebug}
    </div>
  );
};

/**
 * Export
 */
type Fields = { DEFAULTS: typeof DEFAULTS };
export const Image = FC.decorate<t.ImageProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Image' },
);
